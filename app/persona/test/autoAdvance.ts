import type { createPersonaSession } from "./session";
import { currentAnswer, type Action, type Draft } from "./state";
import { validAnswer } from "../_domain/v3/submission";

export const AUTO_ADVANCE_MS = 350;
export const EXIT_MS = 120;
export const ENTER_MS = 180;
type Phase = "idle" | "selected" | "leaving" | "entering";
type Scheduler = { set: (callback: () => void, delay: number) => unknown; clear: (handle: unknown) => void };
type Session = ReturnType<typeof createPersonaSession>;
export const navigationKey = (draft: Draft) => `${draft.phase}:${draft.cursor}`;
const defaultScheduler: Scheduler = {
  set: (callback, delay) => setTimeout(callback, delay),
  clear: handle => clearTimeout(handle as ReturnType<typeof setTimeout>),
};

/** Ephemeral UI timing only. Answers are saved immediately; no timers or locks are persisted. */
export function createAutoAdvance(session: Session, scheduler: Scheduler = defaultScheduler) {
  const initial = { phase: "idle" as Phase };
  let snapshot = initial;
  let generation = 0;
  let timers: unknown[] = [];
  const listeners = new Set<() => void>();
  const setPhase = (phase: Phase) => {
    if (snapshot.phase === phase) return;
    snapshot = { phase }; listeners.forEach(listener => listener());
  };
  const clear = () => { generation++; timers.forEach(handle => scheduler.clear(handle)); timers = []; };
  const cancel = () => { clear(); setPhase("idle"); };
  const enter = () => {
    clear(); setPhase("entering");
    const token = generation;
    timers.push(scheduler.set(() => { if (token === generation) { timers = []; setPhase("idle"); } }, ENTER_MS));
  };
  const matches = (key: string) => session.getSnapshot().hydrated && navigationKey(session.getSnapshot().draft) === key;
  const navigate = (type: Exclude<Action["type"], "answer">, expectedKey: string) => {
    if (!matches(expectedKey) || snapshot.phase === "entering") return false;
    // Back cancels a pending answer. Manual next never competes with the 350 ms timer.
    if (type === "next" && snapshot.phase !== "idle") return false;
    const before = session.getSnapshot().draft;
    cancel();
    session.dispatch({ type });
    if (navigationKey(session.getSnapshot().draft) !== navigationKey(before) || type === "restart") enter();
    return true;
  };
  const canSelect = (value: number, expectedKey: string) => matches(expectedKey) && snapshot.phase === "idle"
    && session.getSnapshot().draft.phase === "question" && validAnswer(value);
  const select = (value: number, expectedKey: string) => {
    if (canSelect(value, expectedKey)) session.dispatch({ type: "answer", value });
  };
  const answer = (value: number, expectedKey: string) => {
    if (!canSelect(value, expectedKey)) return false;
    // Synchronous lock closes the gap before React updates disabled controls.
    setPhase("selected");
    session.dispatch({ type: "answer", value });
    if (currentAnswer(session.getSnapshot().draft) !== value) { cancel(); return false; }
    const token = ++generation;
    const stillCurrent = () => token === generation && matches(expectedKey)
      && currentAnswer(session.getSnapshot().draft) === value;
    timers.push(scheduler.set(() => {
      if (token !== generation) return;
      if (!stillCurrent()) { cancel(); return; }
      setPhase("leaving");
    }, AUTO_ADVANCE_MS - EXIT_MS));
    timers.push(scheduler.set(() => {
      if (token !== generation) return;
      if (!stillCurrent()) { cancel(); return; }
      clear();
      session.dispatch({ type: "next" });
      enter();
    }, AUTO_ADVANCE_MS));
    return true;
  };
  return { answer, select, navigate, cancel, getSnapshot: () => snapshot, getServerSnapshot: () => initial,
    subscribe: (listener: () => void) => { listeners.add(listener); return () => { listeners.delete(listener); }; } };
}

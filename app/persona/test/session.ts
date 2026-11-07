import { answeredCount, initialDraft, parseDraft, reduceDraft, STORAGE_KEY, type Action, type Draft } from "./state";
export type StorageLike = Pick<Storage, "getItem" | "setItem" | "removeItem">;
export type SessionSnapshot = { hydrated: boolean; draft: Draft; storageError: "unavailable" | "invalid" | null; restored: boolean };

/** One store per mounted flow. No storage, DOM, clock or customer data is read during SSR. */
export function createPersonaSession(storageFactory: () => StorageLike) {
  const serverSnapshot: SessionSnapshot = { hydrated: false, draft: initialDraft(), storageError: null, restored: false };
  let snapshot = serverSnapshot;
  let initialized = false;
  let storage: StorageLike | null = null;
  const listeners = new Set<() => void>();
  const emit = () => listeners.forEach(listener => listener());
  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    if (!initialized) {
      initialized = true;
      try {
        storage = storageFactory();
        const raw = storage.getItem(STORAGE_KEY);
        const saved = parseDraft(raw);
        snapshot = { hydrated: true, draft: saved ?? initialDraft(), storageError: raw && !saved ? "invalid" : null, restored: saved !== null && answeredCount(saved) > 0 };
      } catch {
        snapshot = { hydrated: true, draft: initialDraft(), storageError: "unavailable", restored: false };
      }
      emit();
    }
    return () => { listeners.delete(listener); };
  };
  const dispatch = (action: Action) => {
    if (!initialized) return;
    const draft = reduceDraft(snapshot.draft, action);
    if (draft === snapshot.draft) return;
    let storageError = snapshot.storageError === "unavailable" ? "unavailable" as const : null;
    try {
      if (!storage) throw new Error("Storage unavailable");
      if (answeredCount(draft) === 0) storage.removeItem(STORAGE_KEY);
      else storage.setItem(STORAGE_KEY, JSON.stringify(draft));
    } catch { storageError = "unavailable"; }
    snapshot = { hydrated: true, draft, storageError, restored: false };
    emit();
  };
  return { subscribe, dispatch, getSnapshot: () => snapshot, getServerSnapshot: () => serverSnapshot };
}

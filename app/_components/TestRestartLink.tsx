"use client";
import type { CSSProperties, ReactNode } from "react";
/** Use the original test's restart storage operation before returning from a server report. */
export default function TestRestartLink({ href, storageKey, style, children }: {
  href: string; storageKey: string; style?: CSSProperties; children: ReactNode;
}) {
  return <a href={href} style={style} onClick={() => {
    try { localStorage.removeItem(storageKey); } catch { /* Same fallback as the original restart handler. */ }
  }}>{children}</a>;
}

import type { ReactNode } from "react";
import Brand from "./Brand";
import EditorialSurface from "./EditorialSurface";
import styles from "./TestShell.module.css";

/** Presentation only: the existing test owns all state, timers and navigation. */
export default function TestShell({ children }: { children: ReactNode }) {
  return <EditorialSurface><div className={styles.flow}>
    <div className={styles.brand}><Brand /></div>
    {children}
  </div></EditorialSurface>;
}

import type { ReactNode } from "react";
import design from "../_styles/design.module.css";
import styles from "./EditorialSurface.module.css";

/** Page-level opt-in. Never place this in a layout that also wraps a test flow. */
export default function EditorialSurface({ children }: { children: ReactNode }) {
  return <div className={`${design.tokens} ${styles.surface}`}>{children}</div>;
}

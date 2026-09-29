"use client";

import type { MouseEvent, ReactNode } from "react";

type HomeScrollLinkProps = {
  targetId: string;
  className?: string;
  children: ReactNode;
};

export default function HomeScrollLink({ targetId, className, children }: HomeScrollLinkProps) {
  const scrollToTarget = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();

    const target = document.getElementById(targetId);
    if (!target) return;

    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    target.scrollIntoView({ behavior, block: "start" });
    window.history.replaceState(null, "", `#${targetId}`);
  };

  return <a href={`#${targetId}`} className={className} onClick={scrollToTarget}>{children}</a>;
}

type Heading = { focus(options: { preventScroll: boolean }): void };

/** Move keyboard/screen-reader focus without changing any scroll position.
 * Overflow belongs to CSS and the keyed view, never imperative navigation. */
export function positionStep({ heading }: { heading: Heading | null }) {
  heading?.focus({ preventScroll: true });
}

"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";

export type AdhdDeluxePreview = {
  src: string;
  fullSrc: string;
  alt: string;
  caption: string;
};

type Props = {
  previews: readonly AdhdDeluxePreview[];
};

const focusableSelector = "a[href], button:not([disabled]), [tabindex]:not([tabindex='-1'])";

export default function AdhdDeluxePreviewGallery({ previews }: Props) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [zoomed, setZoomed] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const titleId = useId();
  const isOpen = activeIndex !== null;

  const close = () => setActiveIndex(null);

  function open(index: number, trigger: HTMLButtonElement) {
    triggerRef.current = trigger;
    setZoomed(false);
    setActiveIndex(index);
  }

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => closeButtonRef.current?.focus());

    return () => {
      document.body.style.overflow = previousOverflow;
      triggerRef.current?.focus();
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        setActiveIndex((current) => current === null ? null : (current - 1 + previews.length) % previews.length);
        return;
      }

      if (event.key === "ArrowRight") {
        event.preventDefault();
        setActiveIndex((current) => current === null ? null : (current + 1) % previews.length);
        return;
      }

      if (event.key !== "Tab" || !dialogRef.current) return;

      const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(focusableSelector));
      const first = focusable[0];
      const last = focusable.at(-1);
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, previews.length]);

  const activePreview = activeIndex === null ? null : previews[activeIndex];

  return <>
    <div className="-mx-4 mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-3 sm:mx-0 sm:grid sm:grid-cols-2 sm:overflow-visible sm:px-0 lg:grid-cols-4">
      {previews.map((preview, index) => <figure key={preview.src} className="w-[78vw] shrink-0 snap-start overflow-hidden rounded-2xl border border-[#D6E1DD] bg-[#FFFEFC] shadow-sm sm:w-auto">
        <button type="button" onClick={(event) => open(index, event.currentTarget)} className="group relative block w-full cursor-zoom-in overflow-hidden text-left focus-visible:outline-2 focus-visible:outline-offset-[-3px] focus-visible:outline-[#27666A]" aria-label={`Förstora: ${preview.alt}`}>
          <Image src={preview.src} alt={preview.alt} width={700} height={993} sizes="(max-width: 640px) 78vw, (max-width: 1024px) 45vw, 23vw" className="h-auto w-full transition duration-200 group-hover:scale-[1.015]" />
          <span aria-hidden="true" className="absolute bottom-3 right-3 rounded-full bg-[#202124]/80 px-3 py-1.5 text-xs font-semibold text-white shadow-sm">Förstora</span>
        </button>
        <figcaption className="p-4 text-sm leading-6 text-neutral-700">{preview.caption}</figcaption>
      </figure>)}
    </div>

    {activePreview && <div className="fixed inset-0 z-[70] flex items-center justify-center bg-[#202124]/90 p-3 sm:p-6" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
      <div ref={dialogRef} role="dialog" aria-modal="true" aria-labelledby={titleId} className="relative flex max-h-full w-full max-w-[min(96vw,1400px)] flex-col items-center">
        <div className="mb-3 flex w-full items-center justify-between gap-3 text-white"><p id={titleId} className="text-sm font-medium sm:text-base">{activePreview.caption}</p><button ref={closeButtonRef} type="button" onClick={close} className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full border border-white/35 bg-[#202124] px-4 text-sm font-semibold text-white transition hover:bg-[#364A4B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" aria-label="Stäng förhandsvisning">Stäng <span aria-hidden="true" className="ml-2 text-lg leading-none">×</span></button></div>
        <button type="button" aria-pressed={zoomed} onClick={() => setZoomed(!zoomed)} className="mb-3 min-h-11 rounded-lg border border-white/35 bg-[#202124] px-4 text-sm font-semibold text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">{zoomed ? "Anpassa hela sidan" : "Läs större"}</button>
        <div className="min-h-0 max-h-[calc(100dvh-16rem)] w-full max-w-full overflow-auto rounded-xl bg-white shadow-2xl"><Image src={activePreview.fullSrc} alt={activePreview.alt} width={1282} height={1819} unoptimized priority sizes="(max-width: 768px) 96vw, 1282px" className={zoomed ? "mx-auto block h-auto w-[720px] max-w-none sm:w-[960px]" : "mx-auto h-auto max-h-[calc(100dvh-16rem)] w-auto max-w-full object-contain"} /></div>
        <div className="mt-3 flex items-center gap-3 text-white"><button type="button" onClick={() => setActiveIndex((activeIndex! - 1 + previews.length) % previews.length)} className="min-h-11 rounded-lg border border-white/35 bg-[#202124] px-4 text-sm font-semibold transition hover:bg-[#364A4B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" aria-label="Visa föregående förhandsvisning">Föregående</button><span className="text-sm" aria-live="polite">{activeIndex! + 1} av {previews.length}</span><button type="button" onClick={() => setActiveIndex((activeIndex! + 1) % previews.length)} className="min-h-11 rounded-lg border border-white/35 bg-[#202124] px-4 text-sm font-semibold transition hover:bg-[#364A4B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white" aria-label="Visa nästa förhandsvisning">Nästa</button></div>
      </div>
    </div>}
  </>;
}

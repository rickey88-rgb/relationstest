"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";
type Preview = { src: string; fullSrc: string; title: string; caption: string; page: number; cropped?: boolean };
export default function AutismBookPreviewGallery({ previews }: { previews: readonly Preview[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [reading, setReading] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    if (active === null || !dialog.current) return;
    if (!dialog.current.open) dialog.current.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previous; };
  }, [active]);
  const move = (delta: number) => { setActive(index => index === null ? null : (index + delta + previews.length) % previews.length); setReading(false); };
  const current = active === null ? null : previews[active];
  return <><div className={styles.gallery}>{previews.map((preview, index) => <figure key={preview.src}>
    <button className={styles.previewButton} type="button" aria-label={`Förstora sida ${preview.page}: ${preview.title}`} onClick={event => { trigger.current = event.currentTarget; setReading(false); setActive(index); }}><Image src={preview.src} alt={`${preview.title}, ${preview.cropped ? "utsnitt ur " : ""}sida ${preview.page}`} width={600} height={preview.cropped ? 520 : 800} sizes="(max-width: 600px) 78vw, (max-width: 1000px) 44vw, 28vw" /><span>Förstora ↗</span></button>
    <figcaption><span>SIDA {String(preview.page).padStart(2, "0")}{preview.cropped ? " · UTSNITT" : ""}</span><h3>{preview.title}</h3><p>{preview.caption}</p></figcaption>
  </figure>)}</div><dialog ref={dialog} className={styles.dialog} aria-labelledby="autism-preview-title" onClose={() => { setActive(null); setReading(false); trigger.current?.focus(); }} onClick={event => { if (event.target === event.currentTarget) dialog.current?.close(); }} onKeyDown={event => { if (event.key === "ArrowRight") { event.preventDefault(); move(1); } if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); } }}>
    {current && <div className={styles.dialogPanel}><div className={styles.dialogHeader}><p id="autism-preview-title">{current.title}<span>Sida {current.page}{current.cropped ? " · utsnitt" : ""}</span></p><button type="button" autoFocus onClick={() => dialog.current?.close()} aria-label="Stäng förhandsvisningen">Stäng ×</button></div><div className={`${styles.dialogImage} ${reading ? styles.reading : ""}`}><Image src={current.fullSrc} alt={`${current.title}${current.cropped ? " – endast de första två frågorna" : ""}`} width={1200} height={current.cropped ? 1040 : 1600} unoptimized /></div><div className={styles.dialogControls}><button type="button" onClick={() => move(-1)} aria-label="Föregående sida">←</button><span aria-live="polite">{active! + 1} / {previews.length}</span><button type="button" onClick={() => move(1)} aria-label="Nästa sida">→</button><button type="button" aria-pressed={reading} onClick={() => setReading(value => !value)}>{reading ? "Visa hela sidan" : "Visa lässtorlek"}</button></div></div>}
  </dialog></>;
}

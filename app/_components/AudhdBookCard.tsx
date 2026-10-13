import Image from "next/image";
import Link from "next/link";
import styles from "./AudhdBookCard.module.css";

type AudhdBookCardProps = {
  className?: string;
};

/** The standard AuDHD book card, shared by the homepage and relevant guides. */
export default function AudhdBookCard({ className }: AudhdBookCardProps) {
  return (
    <article className={[styles.card, className].filter(Boolean).join(" ")}>
      <Image
        src="/audhd-bok-mockup.png"
        alt="Världens bästa bok om AuDHD av Elias Voss"
        width={1312}
        height={1199}
        sizes="(max-width: 700px) min(100vw - 5rem, 250px), 280px"
        className={styles.mockup}
      />
      <p className={styles.eyebrow}>Digital bok · 149 kr</p>
      <h3>Världens bästa bok om AuDHD</h3>
      <p className={styles.description}>10 konkreta sätt att få livet att fungera när ADHD och autism drar åt varsitt håll.</p>
      <Link href="/audhd-bok" className={styles.link}>
        Läs mer om boken <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}

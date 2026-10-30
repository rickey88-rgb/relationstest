import Link from "next/link";
import Brand from "./Brand";
import HeaderAccountLink from "./HeaderAccountLink";
import styles from "./SiteHeader.module.css";

export default function SiteHeader() {
  return <header className={styles.header}>
    <div className={styles.inner}>
      <Link href="/" className={styles.homeLink} aria-label="Relationsvarning – startsidan">
        <Brand className={styles.brand} markClassName={styles.brandMark} />
      </Link>
      <div className={styles.actions}>
        <div className={styles.assurance}>
          <span>Anonymt</span><span aria-hidden="true">·</span>
          <span>Ingen registrering</span><span aria-hidden="true">·</span><span>Direkt resultat</span>
        </div>
        <nav aria-label="Konto"><HeaderAccountLink /></nav>
      </div>
    </div>
  </header>;
}

"use client";
import { useEffect, useState } from "react";
import BookPurchaseAnalytics from "../_components/BookPurchaseAnalytics";
import styles from "./page.module.css";
export default function AutismBookStickyCta({ price, paymentLink, offerType }: { price: number; paymentLink: string; offerType: "standard" | "analysis" }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const hero = document.getElementById("autism-book-hero");
    if (!hero || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => setShow(!entry.isIntersecting), { threshold: 0.05 });
    observer.observe(hero); return () => observer.disconnect();
  }, []);
  if (!show) return null;
  return <aside className={styles.sticky} aria-label="Köp bok och arbetsblad"><p><span>Två PDF-filer</span><strong>{price} kr</strong></p><BookPurchaseAnalytics productId="autism-bok" productName="AUTISM ALL INCLUSIVE" price={price} paymentLink={paymentLink} offerType={offerType} className={styles.buy}>Bok + arbetsblad ↗</BookPurchaseAnalytics></aside>;
}

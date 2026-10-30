"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { directAuthClient } from "../_lib/testAccounts/directClient";
import { directCustomerEnabled } from "../_lib/testAccounts/directPublic";
import styles from "./SiteHeader.module.css";

export default function HeaderAccountLink() {
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    if (!directCustomerEnabled()) return;
    let active = true;
    try {
      // Reuse the portal's browser singleton and local INITIAL_SESSION event.
      // No getUser/account fetch or server-side personalized header/cache.
      const { data } = directAuthClient().auth.onAuthStateChange((_event, session) => {
        if (active) setSignedIn(Boolean(session?.user && !session.user.is_anonymous
          && session.expires_at && session.expires_at > Date.now() / 1000));
      });
      return () => { active = false; data.subscription.unsubscribe(); };
    } catch {
      // A blocked browser store must never hide navigation or break public pages.
      return;
    }
  }, []);

  return <Link href={signedIn ? "/mina-sidor" : "/mina-sidor#login"} prefetch={false} className={styles.accountLink}>
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true" focusable="false">
      <circle cx="12" cy="8" r="3.5" /><path d="M5 21v-2a7 7 0 0 1 14 0v2" strokeLinecap="round" />
    </svg>
    <span>{signedIn ? "Mina sidor" : "Logga in"}</span>
  </Link>;
}

"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackEvent } from "../_analytics/analytics";
export default function LandingAnalytics() { const pathname = usePathname(); useEffect(() => { if (pathname === "/audhd-test") trackEvent("audhd_landing_view"); }, [pathname]); return null; }

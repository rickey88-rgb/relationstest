"use client";

import { useEffect } from "react";
import { trackEvent } from "../_analytics/analytics";
import { testConfig } from "../_analytics/config";

export default function LandingAnalytics() {
  useEffect(() => { const test = testConfig.iq_test; trackEvent("landing_view", { test_id: "iq_test", test_name: test.name, value: test.price, currency: test.currency }); }, []);
  return null;
}

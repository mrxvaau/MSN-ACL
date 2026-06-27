"use client";

import { useEffect } from "react";

// Pings /api/auth/me every 5 minutes to keep the session alive.
// If session has expired, redirects to login page.
export default function ActivityPing() {
  useEffect(() => {
    const ping = async () => {
      try {
        const res = await fetch("/api/auth/me", { method: "GET", credentials: "same-origin" });
        const data = await res.json();
        if (!data.ok) {
          window.location.href = "/admin/login";
        }
      } catch {
        // Network error — don't redirect, wait for next ping
      }
    };

    // Ping immediately on mount (catches expired sessions on tab restore)
    ping();

    const interval = setInterval(ping, 5 * 60 * 1000); // every 5 minutes
    return () => clearInterval(interval);
  }, []);

  return null; // renders nothing
}

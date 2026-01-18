"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/api/auth-client";

//const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes
const REFRESH_INTERVAL = 30 * 1000; // 30 seconds for testing

export function TokenRefresher() {
  useEffect(() => {
    // Initial refresh logic if needed? No, we just logged in.

    const intervalId = setInterval(async () => {
      try {
        console.log("Refresher: Refreshing token...");
        const res = await authClient.refresh();
        if (res.ok) {
          console.log("Refresher: Token refreshed successfully");
        } else {
          console.error("Refresher: Failed to refresh token", res.status);
          // Optional: Redirect to error page or retry?
        }
      } catch (error) {
        console.error("Refresher: Error refreshing token", error);
      }
    }, REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  return null; // This component does not render anything
}

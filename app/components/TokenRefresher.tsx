"use client";

import { useEffect } from "react";
import { authClient } from "@/lib/api/auth-client";
import { logger } from "@/lib/logger";

//const REFRESH_INTERVAL = 10 * 60 * 1000; // 10 minutes
const REFRESH_INTERVAL = 30 * 1000; // 30 seconds for testing

export function TokenRefresher() {
  useEffect(() => {
    // Initial refresh logic if needed? No, we just logged in.

    const intervalId = setInterval(async () => {
      try {
        logger.debug("Refresher: Refreshing token...");
        const res = await authClient.refresh();
        if (res.ok) {
          logger.debug("Refresher: Token refreshed successfully");
        } else {
          logger.error("Refresher: Failed to refresh token", res.status);
          // Optional: Redirect to error page or retry?
        }
      } catch (error) {
        logger.error("Refresher: Error refreshing token", error);
      }
    }, REFRESH_INTERVAL);

    return () => clearInterval(intervalId);
  }, []);

  return null; // This component does not render anything
}

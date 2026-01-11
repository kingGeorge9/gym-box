"use client";

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const USER_ID_KEY = "anonUserId";

/**
 * Hook to manage anonymous user ID using localStorage
 * Generates a UUID on first visit and persists it
 */
export function useAnonymousUser() {
  const [userId, setUserId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if we're in the browser
    if (typeof window === "undefined") {
      return;
    }

    try {
      // Try to get existing user ID from localStorage
      let storedUserId = localStorage.getItem(USER_ID_KEY);

      if (!storedUserId) {
        // Generate new UUID for first-time user
        storedUserId = uuidv4();
        localStorage.setItem(USER_ID_KEY, storedUserId);
      }

      setUserId(storedUserId);
    } catch (error) {
      console.error("Error accessing localStorage:", error);
      // Fallback to session-only UUID if localStorage is blocked
      setUserId(uuidv4());
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { userId, isLoading };
}

/**
 * Get the anonymous user ID synchronously (client-side only)
 * Use this when you need the ID outside of React components
 */
export function getAnonymousUserId(): string {
  if (typeof window === "undefined") {
    return "";
  }

  try {
    let userId = localStorage.getItem(USER_ID_KEY);
    
    if (!userId) {
      userId = uuidv4();
      localStorage.setItem(USER_ID_KEY, userId);
    }
    
    return userId;
  } catch (error) {
    console.error("Error accessing localStorage:", error);
    return uuidv4(); // Fallback
  }
}

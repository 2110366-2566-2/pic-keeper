"use client";

import authService from "@/services/auth";
import { useSession } from "next-auth/react";
import { useCallback } from "react";

export const useRefreshToken = () => {
  const { data: session } = useSession();
  const refreshToken = useCallback(async () => {
    try {
      if (session) {
        const res = await authService.refreshToken(session?.user.session_token);
        session.user.session_token = res.refreshed_session_token;
      } else {
        throw new Error("No session");
      }
    } catch (error) {
      throw error;
    }
  }, [session]);

  return refreshToken;
};

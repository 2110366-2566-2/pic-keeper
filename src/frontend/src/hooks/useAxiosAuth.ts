"use client";
import apiClient from "@/libs/apiClient";
import authService from "@/services/auth";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const useAxiosAuth = () => {
  const { data: session } = useSession();

  useEffect(() => {
    const requestIntercept = apiClient.interceptors.request.use(
      (config) => {
        if (!config.headers["Authorization"]) {
          config.headers[
            "Authorization"
          ] = `Bearer ${session?.user?.session_token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseIntercept = apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        if (error?.response?.status === 401 && !prevRequest?.sent && session) {
          prevRequest.sent = true;
          const response = await authService.refreshToken(
            session?.user.session_token
          );
          prevRequest.headers[
            "Authorization"
          ] = `Bearer ${response.refreshed_session_token}`;

          return apiClient(prevRequest);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      apiClient.interceptors.request.eject(requestIntercept);
      apiClient.interceptors.response.eject(responseIntercept);
    };
  }, [session]);

  return apiClient;
};

export default useAxiosAuth;

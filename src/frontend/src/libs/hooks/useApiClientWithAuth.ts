import { useSession } from "next-auth/react";
import { useEffect } from "react";
import apiClient from "../apiClient";

const useApiClientWithAuth = () => {
  const { data: session } = useSession();

  useEffect(() => {
    const requestInterceptor = apiClient.interceptors.request.use(
      (config) => {
        if (session?.user?.session_token) {
          config.headers[
            "Authorization"
          ] = `Bearer ${session.user.session_token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      apiClient.interceptors.request.eject(requestInterceptor);
    };
  }, [session]);

  return apiClient;
};

export default useApiClientWithAuth;

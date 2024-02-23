import { useSession } from "next-auth/react";
import { useEffect } from "react";
import apiClient from "../apiClient";
import { useRefreshToken } from "./useRefreshToken";

const useApiClientWithAuth = () => {
  const { data: session } = useSession();
  const refreshToken = useRefreshToken();

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

    const responseInterceptor = apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevReq = error.config;
        if (
          (error.response.status === 401 || error.response.status === 500) &&
          !prevReq.sent
        ) {
          prevReq.sent = true;
          await refreshToken();
          prevReq.headers[
            "Authorization"
          ] = `Bearer ${session?.user.session_token}`;
          return apiClient(prevReq);
        }
        return Promise.reject(error);
      }
    );
    return () => {
      apiClient.interceptors.request.eject(requestInterceptor);
      apiClient.interceptors.response.eject(responseInterceptor);
    };
  }, [refreshToken, session]);

  return apiClient;
};

export default useApiClientWithAuth;

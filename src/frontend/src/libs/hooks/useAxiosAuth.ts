import { useSession } from "next-auth/react";
import { useEffect } from "react";
import axios from "../axios";

const useAxiosAuth = () => {
  const { data: session } = useSession();

  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        if (session?.user?.sessionToken) {
          config.headers[
            "Authorization"
          ] = `Bearer ${session.user.sessionToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
    };
  }, [session]);

  return axios;
};

export default useAxiosAuth;

import apiClient from "@/libs/apiClient";
import { LoginCredentials } from "@/types/auth";
import {
  GoogleLoginResponse,
  LoginResponse,
  RefreshTokenResponse,
  UserResponse,
} from "@/types/response";
import { NewUser } from "@/types/user";

const authBaseUrl = `/authen/v1`;

const register = async (newUser: NewUser) => {
  try {
    const { data } = await apiClient.post<UserResponse>(
      `${authBaseUrl}/register`,
      newUser
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const login = async (loginCredentials: LoginCredentials) => {
  try {
    const { data } = await apiClient.post<LoginResponse>(
      `${authBaseUrl}/login`,
      loginCredentials
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const refreshToken = async (token: string) => {
  try {
    const { data } = await apiClient.get<RefreshTokenResponse>(
      `${authBaseUrl}/refresh`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const googleLogin = async () => {
  try {
    const { data } = await apiClient.post<GoogleLoginResponse>(
      `${authBaseUrl}/google/login`
    );
    console.log("Google!",data);
    return data;
  } catch (error) {
    throw error;
  }
};

const authService = {
  register,
  login,
  refreshToken,
  googleLogin,
};

export default authService;

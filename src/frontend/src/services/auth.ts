import apiClient from "@/libs/apiClient";
import {
  GoogleLoginResponse,
  LoginCredentials,
  LoginResponse,
  NewUser,
  RefreshTokenResponse,
  RegisterCustomerResponse,
} from "@/types";

const authBaseUrl = `/authen/v1`;

const register = async (newUser: NewUser) => {
  try {
    const { data } = await apiClient.post<RegisterCustomerResponse>(
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

import apiClient from "@/libs/apiClient";
import {
  GoogleLoginResponse,
  LoginCredentials,
  LoginResponse,
  NewUser,
  RefreshTokenResponse,
  RegisterCustomerResponse,
  RegisterPhotoGrapherResponse,
} from "@/types";

const authBaseUrl = `/authen/v1`;

const registerCustomer = async (newUser: NewUser) => {
  try {
    const response = await apiClient.post<RegisterCustomerResponse>(
      `${authBaseUrl}/register/customer`,
      newUser
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const registerPhotographer = async (newPhotographer: NewUser) => {
  try {
    const response = await apiClient.post<RegisterPhotoGrapherResponse>(
      `${authBaseUrl}/register/photographer`,
      newPhotographer
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const login = async (loginCredentials: LoginCredentials) => {
  try {
    const response = await apiClient.post<LoginResponse>(
      `${authBaseUrl}/login`,
      loginCredentials
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const refreshToken = async (token: string) => {
  try {
    const response = await apiClient.get<RefreshTokenResponse>(
      `${authBaseUrl}/refresh`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const googleLogin = async () => {
  try {
    const response = await apiClient.post<GoogleLoginResponse>(
      `${authBaseUrl}/google/login`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const authService = {
  registerCustomer,
  registerPhotographer,
  login,
  refreshToken,
  googleLogin,
};

export default authService;

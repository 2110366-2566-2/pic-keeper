import ApiError from "@/libs/ApiError";
import apiClient from "@/libs/apiClient";
import {
  ErrorResponse,
  GoogleLoginResponse,
  LoginCredentials,
  LoginResponse,
  NewUser,
  RefreshTokenResponse,
  RegisterCustomerResponse,
  RegisterPhotoGrapherResponse,
  Status,
} from "@/types";
import { Axios, AxiosError } from "axios";

const authBaseUrl = "/authen/v1";

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

const refreshToken = async (axiosInstance: Axios) => {
  try {
    const response = await axiosInstance.post<RefreshTokenResponse>(
      `${authBaseUrl}/refresh`
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

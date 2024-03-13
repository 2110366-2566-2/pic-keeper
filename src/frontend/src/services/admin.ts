import apiClient from "@/libs/apiClient";
import apiClientWithAuth from "@/libs/apiClientWithAuth";
import {
  ListUnverifiedPhotographerResponse,
  LoginCredentials,
  LoginResponse,
  LogoutResponse,
  RefreshTokenResponse,
  VerifyResponse,
} from "@/types";
import { signOut } from "next-auth/react";

const adminBaseUrl = "/admin/v1";

const login = async (loginCredentials: LoginCredentials) => {
  try {
    const response = await apiClient.post<LoginResponse>(
      `${adminBaseUrl}/login`,
      loginCredentials
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const refresh = async (token: string) => {
  try {
    const response = await apiClient.get<RefreshTokenResponse>(
      `${adminBaseUrl}/refresh`,
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

const listUnverifiedPhotographer = async () => {
  try {
    const response =
      await apiClientWithAuth.get<ListUnverifiedPhotographerResponse>(
        `${adminBaseUrl}/verifications/unverified-photographers`
      );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const verify = async (id: string) => {
  try {
    const response = await apiClientWithAuth.put<VerifyResponse>(
      `${adminBaseUrl}/verifications/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const logout = async () => {
  try {
    const response = await apiClientWithAuth.put<LogoutResponse>(
      `${adminBaseUrl}/logout`
    );
    signOut();
    return response.data;
  } catch (error) {
    throw error;
  }
};

const adminService = {
  login,
  refresh,
  listUnverifiedPhotographer,
  verify,
  logout,
};

export default adminService;

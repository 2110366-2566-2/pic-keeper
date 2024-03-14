import apiClient from "@/libs/apiClient";
import apiClientWithAuth from "@/libs/apiClientWithAuth";
import {
  LoginCredentials,
  LoginResponse,
  LogoutResponse,
  RefreshTokenResponse,
  UserListResponse,
  UserResponse,
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

const listPendingPhotographer = async () => {
  try {
    const response = await apiClientWithAuth.get<UserListResponse>(
      `${adminBaseUrl}/verifications/pending-photographers`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const verify = async (id: string) => {
  try {
    const response = await apiClientWithAuth.put<UserResponse>(
      `${adminBaseUrl}/verifications/verify/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const reject = async (id: string) => {
  try {
    const response = await apiClientWithAuth.put<UserResponse>(
      `${adminBaseUrl}/verifications/reject/${id}`
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
  listPendingPhotographer,
  verify,
  reject,
  logout,
};

export default adminService;

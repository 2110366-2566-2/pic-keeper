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
    const { data } = await apiClient.post<LoginResponse>(
      `${adminBaseUrl}/login`,
      loginCredentials
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const refresh = async (token: string) => {
  try {
    const { data } = await apiClient.get<RefreshTokenResponse>(
      `${adminBaseUrl}/refresh`,
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

const listPendingPhotographer = async () => {
  try {
    const { data } = await apiClientWithAuth.get<UserListResponse>(
      `${adminBaseUrl}/verifications/pending-photographers`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const verify = async (id: string) => {
  try {
    const { data } = await apiClientWithAuth.put<UserResponse>(
      `${adminBaseUrl}/verifications/verify/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const reject = async (id: string) => {
  try {
    const { data } = await apiClientWithAuth.put<UserResponse>(
      `${adminBaseUrl}/verifications/reject/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const logout = async () => {
  try {
    const { data } = await apiClientWithAuth.put<LogoutResponse>(
      `${adminBaseUrl}/logout`
    );
    signOut();
    return data;
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

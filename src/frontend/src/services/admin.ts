import apiClient from "@/libs/apiClient";
import { LoginCredentials } from "@/types/auth";
import {
  LoginResponse,
  LogoutResponse,
  RefreshTokenResponse,
  UserListResponse,
  UserResponse,
} from "@/types/response";
import { Axios } from "axios";
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

const refreshToken = async (token: string) => {
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

const listPendingPhotographer = async (apiWithAuthForAdmin: Axios) => {
  try {
    const { data } = await apiWithAuthForAdmin.get<UserListResponse>(
      `${adminBaseUrl}/verifications/pending-photographers`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const verify = async (apiWithAuthForAdmin: Axios, id: string) => {
  try {
    const { data } = await apiWithAuthForAdmin.put<UserResponse>(
      `${adminBaseUrl}/verifications/verify/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const reject = async (apiWithAuthForAdmin: Axios, id: string) => {
  try {
    const { data } = await apiWithAuthForAdmin.put<UserResponse>(
      `${adminBaseUrl}/verifications/reject/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const logout = async (apiWithAuthForAdmin: Axios) => {
  try {
    const { data } = await apiWithAuthForAdmin.put<LogoutResponse>(
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
  refreshToken,
  listPendingPhotographer,
  verify,
  reject,
  logout,
};

export default adminService;

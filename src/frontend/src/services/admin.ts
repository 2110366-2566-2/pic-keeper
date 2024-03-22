<<<<<<< HEAD
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
||||||| 4be7c59
import apiClient from "@/libs/apiClient";
import apiClientWithAuth from "@/libs/apiClientWithAuth";
import { LoginCredentials } from "@/types/auth";
import {
  LoginResponse,
  LogoutResponse,
  RefreshTokenResponse,
  UserListResponse,
  UserResponse,
} from "@/types/response";
import { signOut } from "next-auth/react";
=======
import apiClientWithAuth from "@/libs/apiClientWithAuth";
import { UserListResponse, UserResponse } from "@/types/response";
>>>>>>> 1d9df7e442fbdd260f40258842ff7e304d8c39a9

const adminBaseUrl = "/admin/v1";

<<<<<<< HEAD
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
||||||| 4be7c59
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
=======
const listPendingPhotographer = async () => {
>>>>>>> 1d9df7e442fbdd260f40258842ff7e304d8c39a9
  try {
<<<<<<< HEAD
    const { data } = await apiWithAuthForAdmin.get<UserListResponse>(
      `${adminBaseUrl}/verifications/pending-photographers`
||||||| 4be7c59
    const { data } = await apiClientWithAuth.get<UserListResponse>(
      `${adminBaseUrl}/verifications/pending-photographers`
=======
    const { data } = await apiClientWithAuth.get<UserListResponse>(
      `${adminBaseUrl}/pending-photographers`
>>>>>>> 1d9df7e442fbdd260f40258842ff7e304d8c39a9
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const verify = async (apiWithAuthForAdmin: Axios, id: string) => {
  try {
<<<<<<< HEAD
    const { data } = await apiWithAuthForAdmin.put<UserResponse>(
      `${adminBaseUrl}/verifications/verify/${id}`
||||||| 4be7c59
    const { data } = await apiClientWithAuth.put<UserResponse>(
      `${adminBaseUrl}/verifications/verify/${id}`
=======
    const { data } = await apiClientWithAuth.put<UserResponse>(
      `${adminBaseUrl}/verify/${id}`
>>>>>>> 1d9df7e442fbdd260f40258842ff7e304d8c39a9
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const reject = async (apiWithAuthForAdmin: Axios, id: string) => {
  try {
<<<<<<< HEAD
    const { data } = await apiWithAuthForAdmin.put<UserResponse>(
      `${adminBaseUrl}/verifications/reject/${id}`
||||||| 4be7c59
    const { data } = await apiClientWithAuth.put<UserResponse>(
      `${adminBaseUrl}/verifications/reject/${id}`
=======
    const { data } = await apiClientWithAuth.put<UserResponse>(
      `${adminBaseUrl}/reject/${id}`
>>>>>>> 1d9df7e442fbdd260f40258842ff7e304d8c39a9
    );
    return data;
  } catch (error) {
    throw error;
  }
};

<<<<<<< HEAD
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

||||||| 4be7c59
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

=======
>>>>>>> 1d9df7e442fbdd260f40258842ff7e304d8c39a9
const adminService = {
<<<<<<< HEAD
  login,
  refreshToken,
||||||| 4be7c59
  login,
  refresh,
=======
>>>>>>> 1d9df7e442fbdd260f40258842ff7e304d8c39a9
  listPendingPhotographer,
  verify,
  reject,
};

export default adminService;

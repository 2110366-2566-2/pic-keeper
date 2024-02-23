import apiClient from "@/libs/apiClient";
import {
  ListUnverifiedPhotographerResponse,
  LoginCredentials,
  LoginResponse,
  RefreshTokenResponse,
  VerifyResponse,
} from "@/types";
import axios, { Axios } from "axios";

const adminBaseUrl = "/admin/v1";

const login = async (loginCredentials: LoginCredentials) => {
  try {
    const response = await axios.post<LoginResponse>(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/${adminBaseUrl}/login`,
      loginCredentials
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const refresh = async (token: string) => {
  try {
    const response = await axios.get<RefreshTokenResponse>(
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
    const response = await apiClient.get<ListUnverifiedPhotographerResponse>(
      `${adminBaseUrl}/verifications/unverified-photographers`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const verify = async (id: string) => {
  try {
    const response = await apiClient.put<VerifyResponse>(
      `${adminBaseUrl}/verifications/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const adminService = { login, refresh, listUnverifiedPhotographer, verify };

export default adminService;

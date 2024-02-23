import apiClient from "@/libs/apiClient";
import {
  ListUnverifiedPhotographerResponse,
  LoginCredentials,
  LoginResponse,
  RefreshTokenResponse,
  VerifyResponse,
} from "@/types";
import { Axios } from "axios";

const adminBaseUrl = "admin";

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

const refresh = async (apiClientWithAuth: Axios) => {
  try {
    const response = await apiClientWithAuth.get<RefreshTokenResponse>(
      `${adminBaseUrl}/refresh`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const listUnverifiedPhotographer = async (apiClientWithAuth: Axios) => {
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

const verify = async (apiClientWithAuth: Axios, id: string) => {
  try {
    const response = await apiClientWithAuth.put<VerifyResponse>(
      `${adminBaseUrl}/verifications/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const adminService = { login, refresh, listUnverifiedPhotographer, verify };

export default adminService;

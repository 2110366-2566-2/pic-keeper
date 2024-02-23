import {
  GetUserInfoResponse,
  LogoutResponse,
  UploadProfilePictureResponse,
} from "@/types";
import { Axios } from "axios";
import { signOut } from "next-auth/react";

const userBaseUrl = "/users/v1";

const logout = async (apiClientWithAuth: Axios) => {
  try {
    const response = await apiClientWithAuth.put<LogoutResponse>(
      `${userBaseUrl}/logout`
    );
    signOut();
    return response.data;
  } catch (error) {
    throw error;
  }
};

const uploadProfile = async (apiClientWithAuth: Axios, file: File) => {
  try {
    const formData = new FormData();

    formData.append("profilePicture", file);
    const response = await apiClientWithAuth.post<UploadProfilePictureResponse>(
      `${userBaseUrl}/upload-profile`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getMyUserInfo = async (apiClientWithAuth: Axios) => {
  try {
    const response = await apiClientWithAuth.get<GetUserInfoResponse>(
      `${userBaseUrl}/get-my-user-info`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getUserById = async (apiClientWithAuth: Axios, id: string) => {
  try {
    const response = await apiClientWithAuth.post<GetUserInfoResponse>(
      `${userBaseUrl}/get-user/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const userService = {
  logout,
  uploadProfile,
  getMyUserInfo,
  getUserById,
};

export default userService;

import apiClientWithAuth from "@/libs/apiClientWithAuth";
import {
  GetUserInfoResponse,
  LogoutResponse,
  UploadProfilePictureResponse,
  UserResponse,
} from "@/types";
import { signOut } from "next-auth/react";

const userBaseUrl = "/users/v1";

const logout = async () => {
  try {
    const { data } = await apiClientWithAuth.put<LogoutResponse>(
      `${userBaseUrl}/logout`
    );
    signOut();
    return data;
  } catch (error) {
    throw error;
  }
};

const uploadProfile = async (file: File) => {
  try {
    const formData = new FormData();

    formData.append("profilePicture", file);
    const { data } = await apiClientWithAuth.post<UploadProfilePictureResponse>(
      `${userBaseUrl}/upload-profile`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const getMyUserInfo = async () => {
  try {
    const { data } = await apiClientWithAuth.get<GetUserInfoResponse>(
      `${userBaseUrl}/get-my-user-info`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const getUserById = async (id: string) => {
  try {
    const { data } = await apiClientWithAuth.get<GetUserInfoResponse>(
      `${userBaseUrl}/get-user/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const requestVerify = async () => {
  try {
    const { data } = await apiClientWithAuth.get<UserResponse>(
      `${userBaseUrl}/req-verify`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const getSelfStatus = async () => {
  try {
    const { data } = await apiClientWithAuth.get<UserResponse>(
      `${userBaseUrl}/self-status`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const userService = {
  logout,
  uploadProfile,
  getMyUserInfo,
  getUserById,
  requestVerify,
  getSelfStatus,
};

export default userService;

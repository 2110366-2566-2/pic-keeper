import { Axios } from "axios";
import { signOut } from "next-auth/react";

const userBaseUrl = "/users/v1";

const logout = async (axiosInstance: Axios) => {
  try {
    const response = await axiosInstance.put(`${userBaseUrl}/logout`);
    signOut();
    return response.data;
  } catch (error) {
    throw error;
  }
};

const uploadProfile = async (axiosInstance: Axios, file: File) => {
  try {
    const formData = new FormData();

    formData.append("profilePicture", file);
    const response = await axiosInstance.post(
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

const getMyUserInfo = async (axiosInstance: Axios) => {
  try {
    const response = await axiosInstance.get(`${userBaseUrl}/get-my-user-info`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getUserById = async (axiosInstance: Axios, id: string) => {
  try {
    const response = await axiosInstance.post(`${userBaseUrl}/get-user/${id}`);
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

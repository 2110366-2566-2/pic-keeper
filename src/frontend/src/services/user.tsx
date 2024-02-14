import { Axios } from "axios";

const userBaseUrl = "/users/v1";

const logout = async (axiosInstance: Axios) => {
  try {
    const response = await axiosInstance.post(`${userBaseUrl}/logout`);
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

const getMyUserProfile = async (axiosInstance: Axios) => {
  try {
    const response = await axiosInstance.post(
      `${userBaseUrl}/get-my-user-profile`
    );
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
  getMyUserProfile,
  getUserById,
};

export default userService;

import axios from "axios";

const authBaseUrl = "http://localhost:8080/users/v1";

const logout = async () => {
  try {
    const response = await axios.post(`${authBaseUrl}/logout`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const uploadProfile = async (file: File) => {
  try {
    const formData = new FormData();

    formData.append("profilePicture", file);
    const response = await axios.post(
      `${authBaseUrl}/upload-profile`,
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

const getMyUserProfile = async () => {
  try {
    const response = await axios.post(`${authBaseUrl}/get-my-user-profile`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getUserById = async (id: string) => {
  try {
    const response = await axios.post(`${authBaseUrl}/get-user/${id}`);
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

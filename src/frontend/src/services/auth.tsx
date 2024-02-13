import axios from "@/libs/axios";

const authBaseUrl = "/authen/v1";

const registerCustomer = async (newUser: NewUser) => {
  try {
    const response = await axios.post(
      `${authBaseUrl}/register/customer`,
      newUser
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const login = async (loginCredentials: LoginCredentials) => {
  try {
    const response = await axios.post(`${authBaseUrl}/login`, loginCredentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// TODO googleLogin googleCallback

const authService = { registerCustomer, login };

export default authService;

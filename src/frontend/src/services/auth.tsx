import axios from "@/libs/axios";
import { LoginCredentials, NewUser, registerCustomerResponse } from "@/types";

const authBaseUrl = "/authen/v1";

const registerCustomer = async (newUser: NewUser) => {
  try {
    const response = await axios.post<registerCustomerResponse>(
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

const googleLogin = async () => {
  try {
    const response = await axios.post(`${authBaseUrl}/google/login`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const authService = { registerCustomer, login, googleLogin };

export default authService;

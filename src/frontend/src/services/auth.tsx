import axios from "@/libs/axios";
import { signOut } from "next-auth/react";

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

const logIn = async (loginCredentials: LoginCredentials) => {
  try {
    const response = await axios.post(`${authBaseUrl}/login`, loginCredentials);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const logOut = async (token:string)=>{
  try{
  const headers = {
    'Authorization': `Bearer ${token}`,
  };
  const config = {
    method: 'put',
    url: '/users/v1/logout',
    headers: headers,
  };

  const response = await axios(config);
  signOut();

  console.log('Logout successful:', response.data);
}catch(error){
  throw error;
}


}

// TODO googleLogin googleCallback

const authService = { registerCustomer, logIn , logOut };

export default authService;

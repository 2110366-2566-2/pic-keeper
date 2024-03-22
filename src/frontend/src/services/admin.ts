import apiClientWithAuth from "@/libs/apiClientWithAuth";
import { UserListResponse, UserResponse } from "@/types/response";
import { Axios } from "axios";

const adminBaseUrl = "/admin/v1";

const listPendingPhotographer = async () => {
  try {
    const { data } = await apiClientWithAuth.get<UserListResponse>(
      `${adminBaseUrl}/pending-photographers`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const verify = async (apiWithAuthForAdmin: Axios, id: string) => {
  try {
    const { data } = await apiClientWithAuth.put<UserResponse>(
      `${adminBaseUrl}/verify/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const reject = async (apiWithAuthForAdmin: Axios, id: string) => {
  try {
    const { data } = await apiClientWithAuth.put<UserResponse>(
      `${adminBaseUrl}/reject/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const adminService = {
  listPendingPhotographer,
  verify,
  reject,
};

export default adminService;

import apiClientWithAuth from "@/libs/apiClientWithAuth";
import {
  PackageResponse,
  GetPackageListResponse,
  NewPackage,
  DeleteResponse,
} from "@/types";

const photographerPackageBaseUrl = "/photographers/v1/packages";

const getAllPackages = async () => {
  try {
    const response = await apiClientWithAuth.get<GetPackageListResponse>(
      `${photographerPackageBaseUrl}/list`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

const createPackage = async (newPackage: NewPackage) => {
  try {
    const response = await apiClientWithAuth.post<PackageResponse>(
      `${photographerPackageBaseUrl}t`,
      newPackage
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

const updatePackage = async (id: string, newPackage: NewPackage) => {
  try {
    const response = await apiClientWithAuth.put<PackageResponse>(
      `${photographerPackageBaseUrl}/${id}`,
      newPackage
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

const deletePackage = async (id: string) => {
  try {
    const response = await apiClientWithAuth.delete<DeleteResponse>(
      `${photographerPackageBaseUrl}/${id}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

const getPackage = async (id: string) => {
  try {
    const response = await apiClientWithAuth.get<PackageResponse>(
      `${photographerPackageBaseUrl}/${id}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};
const photographerPackageService = {
  getAllPackages,
  createPackage,
  updatePackage,
  deletePackage,
  getPackage,
};

export default photographerPackageService;

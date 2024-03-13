import apiClientWithAuth from "@/libs/apiClientWithAuth";
import { SearchFilter } from "@/types";

const packageBaseUrl = "package/v1/";

const search = async (searchFilter: SearchFilter) => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(searchFilter).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await apiClientWithAuth.get(
      `${packageBaseUrl}?${queryParams.toString()}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const packageService = { search };

export default packageService;

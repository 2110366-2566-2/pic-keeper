import apiClientWithAuth from "@/libs/apiClientWithAuth";
import { SearchFilter } from "@/types";

const packageBaseUrl = "package/v1/";

const search = async (searchFilter: SearchFilter) => {
  try {
    const response = await apiClientWithAuth.post(
      `${packageBaseUrl}`,
      searchFilter
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const packageService = { search };

export default packageService;

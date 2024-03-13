import apiClientWithAuth from "@/libs/apiClientWithAuth";
import { GalleryListResponse, SearchFilter, UrlsListResponse } from "@/types";

const galleryBaseUrl = "galleries/v1/";

const search = async (searchFilter: SearchFilter) => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(searchFilter).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await apiClientWithAuth.get<GalleryListResponse>(
      `${galleryBaseUrl}?${queryParams.toString()}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getPhotoUrlsListInGallery = async (id: string) => {
  try {
    const response = await apiClientWithAuth.get<UrlsListResponse>(
      `${galleryBaseUrl}/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const packageService = { search, getPhotoUrlsListInGallery };

export default packageService;

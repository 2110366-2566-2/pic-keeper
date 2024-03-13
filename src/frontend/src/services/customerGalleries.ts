import apiClientWithAuth from "@/libs/apiClientWithAuth";
import { GalleryListResponse, SearchFilter, UrlsListResponse } from "@/types";

const customerGalleriesBaseUrl = "customers/galleries/v1/";

const search = async (searchFilter: SearchFilter) => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(searchFilter).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await apiClientWithAuth.get<GalleryListResponse>(
      `${customerGalleriesBaseUrl}?${queryParams.toString()}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getPhotoUrlsListInGallery = async (id: string) => {
  try {
    const response = await apiClientWithAuth.get<UrlsListResponse>(
      `${customerGalleriesBaseUrl}/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const customerGalleriesService = { search, getPhotoUrlsListInGallery };

export default customerGalleriesService;

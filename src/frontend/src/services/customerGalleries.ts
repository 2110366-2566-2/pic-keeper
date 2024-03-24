import apiClient from "@/libs/apiClient";
import { SearchFilter } from "@/types/gallery";
import { GalleryListResponse, UrlsListResponse } from "@/types/response";

const customerGalleriesBaseUrl = "/customers/galleries/v1";

const search = async (searchFilter: SearchFilter = {}) => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(searchFilter).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const { data } = await apiClient.get<GalleryListResponse>(
      `${customerGalleriesBaseUrl}/search?${queryParams.toString()}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const getPhotoUrlsListInGallery = async (id: string) => {
  try {
    const { data } = await apiClient.get<UrlsListResponse>(
      `${customerGalleriesBaseUrl}/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const customerGalleriesService = { search, getPhotoUrlsListInGallery };

export default customerGalleriesService;

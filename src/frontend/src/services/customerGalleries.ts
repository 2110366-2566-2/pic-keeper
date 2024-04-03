import apiClient from "@/libs/apiClient";
import { SearchFilter } from "@/types/gallery";
import {
  GalleryListResponse,
  SuccessResponse,
  UrlsListResponse,
} from "@/types/response";
import { Review } from "@/types/review";

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

const listReviewByGalleryId = async (id: string) => {
  try {
    const { data } = await apiClient.get<SuccessResponse<Review[]>>(
      `${customerGalleriesBaseUrl}/${id}/reviews`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const customerGalleriesService = {
  search,
  getPhotoUrlsListInGallery,
  listReviewByGalleryId,
};

export default customerGalleriesService;

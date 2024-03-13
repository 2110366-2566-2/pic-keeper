import apiClientWithAuth from "@/libs/apiClientWithAuth";
import {
  GalleryResponse,
  GalleryListResponse,
  NewGallery,
  DeleteResponse,
  PhotoResponse,
} from "@/types";

const photographerGalleryBaseUrl = "/photographers/v1/galleries";

const getAllGalleries = async () => {
  try {
    const response = await apiClientWithAuth.get<GalleryListResponse>(
      `${photographerGalleryBaseUrl}/list`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

const createGallery = async (newGallery: NewGallery) => {
  try {
    const response = await apiClientWithAuth.post<GalleryResponse>(
      `${photographerGalleryBaseUrl}t`,
      newGallery
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

const uploadPhotoToGallery = async (id: string, file: File) => {
  try {
    const formData = new FormData();

    formData.append("picture", file);
    const response = await apiClientWithAuth.post<PhotoResponse>(
      `${photographerGalleryBaseUrl}/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateGallery = async (id: string, newGallery: NewGallery) => {
  try {
    const response = await apiClientWithAuth.put<GalleryResponse>(
      `${photographerGalleryBaseUrl}/${id}`,
      newGallery
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

const deleteGallery = async (id: string) => {
  try {
    const response = await apiClientWithAuth.delete<DeleteResponse>(
      `${photographerGalleryBaseUrl}/${id}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

const deletePhotoFromGallery = async (id: string, photoId: string) => {
  try {
    const response = await apiClientWithAuth.delete<DeleteResponse>(
      `${photographerGalleryBaseUrl}/${id}/${photoId}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};

const getGallery = async (id: string) => {
  try {
    const response = await apiClientWithAuth.get<GalleryResponse>(
      `${photographerGalleryBaseUrl}/${id}`
    );
    return response.data;
  } catch (error) {
    return error;
  }
};
const photographerGalleryService = {
  getAllGalleries,
  createGallery,
  uploadPhotoToGallery,
  updateGallery,
  deleteGallery,
  deletePhotoFromGallery,
  getGallery,
};

export default photographerGalleryService;

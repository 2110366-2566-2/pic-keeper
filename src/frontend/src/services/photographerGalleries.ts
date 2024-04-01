import apiClient from "@/libs/apiClient";
import apiClientWithAuth from "@/libs/apiClientWithAuth";
import { NewGallery } from "@/types/gallery";
import {
  GalleryListResponse,
  GalleryResponse,
  PhotoResponse,
  DeleteResponse,
} from "@/types/response";
import { Axios } from "axios";

const photographerGalleryBaseUrl = "/photographers/galleries/v1";

const getAllMyGalleries = async () => {
  try {
    const { data } = await apiClientWithAuth.get<GalleryListResponse>(
      `${photographerGalleryBaseUrl}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const createGallery = async (newGallery: NewGallery) => {
  try {
    const { data } = await apiClientWithAuth.post<GalleryResponse>(
      `${photographerGalleryBaseUrl}`,
      newGallery
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const uploadPhotoToGallery = async (
  apiClientForForm: Axios,
  id: string,
  file: File
) => {
  try {
    const formData = new FormData();

    formData.append("picture", file);
    const { data } = await apiClientForForm.post<PhotoResponse>(
      `${photographerGalleryBaseUrl}/${id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const updateGallery = async (id: string, newGallery: NewGallery) => {
  try {
    const { data } = await apiClientWithAuth.put<GalleryResponse>(
      `${photographerGalleryBaseUrl}/${id}`,
      newGallery
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const deleteGallery = async (id: string) => {
  try {
    const { data } = await apiClientWithAuth.delete<DeleteResponse>(
      `${photographerGalleryBaseUrl}/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const deletePhotoFromGallery = async (id: string, photoId: string) => {
  try {
    const { data } = await apiClientWithAuth.delete<DeleteResponse>(
      `${photographerGalleryBaseUrl}/${id}/${photoId}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const getGallery = async (id: string) => {
  try {
    const { data } = await apiClient.get<GalleryResponse>(
      `${photographerGalleryBaseUrl}/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};
const photographerGalleriesService = {
  getAllMyGalleries,
  createGallery,
  uploadPhotoToGallery,
  updateGallery,
  deleteGallery,
  deletePhotoFromGallery,
  getGallery,
};

export default photographerGalleriesService;

import apiClientWithAuth from "@/libs/apiClientWithAuth";
import { SuccessResponse } from "@/types/response";
import { Review, ReviewInput } from "@/types/review";

const customerReviewBaseUrl = "/customers/reviews/v1";

const createReview = async (reviewInput: ReviewInput) => {
  try {
    const { data } = await apiClientWithAuth.post<SuccessResponse<Review>>(
      `${customerReviewBaseUrl}`,
      reviewInput
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const updateReview = async (reviewInput: ReviewInput ,id:string) => {
  try {
    const { data } = await apiClientWithAuth.put<SuccessResponse<Review>>(
      `${customerReviewBaseUrl}/${id}`,
      reviewInput
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const deleteReview = async (id:string) => {
  try {
    const { data } = await apiClientWithAuth.delete<SuccessResponse<string>>(
      `${customerReviewBaseUrl}/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const myReviews = async () => {
  try {
    const { data } = await apiClientWithAuth.get<SuccessResponse<Review[]>>(
      `${customerReviewBaseUrl}/my-reviews`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const customerReviewService = {
  createReview,
  updateReview,
  deleteReview,
  myReviews,
};

export default customerReviewService;

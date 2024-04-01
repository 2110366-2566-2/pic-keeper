import apiClientWithAuth from "@/libs/apiClientWithAuth";
import { SuccessResponse } from "@/types/response";
import { Review } from "@/types/review";

const photographerReviewBaseUrl = "/photographers/reviews/v1";

const listReceivedReviews = async () => {
  try {
    const { data } = await apiClientWithAuth.get<SuccessResponse<Review[]>>(
      `${photographerReviewBaseUrl}/list`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const photographerReviewService = { listReceivedReviews };

export default photographerReviewService;

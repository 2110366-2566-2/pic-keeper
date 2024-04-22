import apiClient from "@/libs/apiClient";
import { BookingResponse } from "@/types/response";

const paymentBaseUrl = "/payment";

const makeBookingPayment = async (bookingId: string) => {
  try {
    const { data } = await apiClient.get<BookingResponse>(
      `${paymentBaseUrl}/${bookingId}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const paymentService = {
  makeBookingPayment,
};

export default paymentService;

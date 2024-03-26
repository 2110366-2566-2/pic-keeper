import apiClientWithAuth from "@/libs/apiClientWithAuth";
import { BookingProposal } from "@/types/booking";
import {
  BookingResponse,
  BookingListResponse,
  StringResponse,
} from "@/types/response";

const bookingBaseUrl = "/customers/bookings/v1";

const getPendingCancellations = async () => {
  try {
    const { data } = await apiClientWithAuth.get<BookingListResponse>(
      `${bookingBaseUrl}/pending-cancellations`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const getUpcomingBookings = async () => {
  try {
    const { data } = await apiClientWithAuth.get<BookingListResponse>(
      `${bookingBaseUrl}/upcoming`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const getPastBookings = async () => {
  try {
    const { data } = await apiClientWithAuth.get<BookingListResponse>(
      `${bookingBaseUrl}/past`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const getAllBookings = async () => {
  try {
    const { data } = await apiClientWithAuth.get<BookingListResponse>(
      `${bookingBaseUrl}/my-bookings`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const getBooking = async (id: string) => {
  try {
    const { data } = await apiClientWithAuth.get<BookingResponse>(
      `${bookingBaseUrl}/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const cancelBooking = async (id: string) => {
  try {
    const { data } = await apiClientWithAuth.get<BookingResponse>(
      `${bookingBaseUrl}/cancel/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const approveCancelBooking = async (id: string) => {
  try {
    const { data } = await apiClientWithAuth.get<BookingResponse>(
      `${bookingBaseUrl}/approve-cancel/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const getQRCode = async (id: string) => {
  try {
    const { data } = await apiClientWithAuth.get<StringResponse>(
      `${bookingBaseUrl}/get-qr/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const requestRefund = async (id: string) => {
  try {
    const { data } = await apiClientWithAuth.get<BookingResponse>(
      `${bookingBaseUrl}/req-refund/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const customerBookingService = {
  getPendingCancellations,
  getUpcomingBookings,
  getPastBookings,
  getAllBookings,
  getBooking,
  cancelBooking,
  approveCancelBooking,
  getQRCode,
  requestRefund,
};

export default customerBookingService;

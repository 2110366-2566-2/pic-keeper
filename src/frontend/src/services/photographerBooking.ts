import apiClientWithAuth from "@/libs/apiClientWithAuth";
import { BookingListResponse, BookingResponse } from "@/types";

const photographerBookingBaseUrl = "photographers/v1/bookings";

const getPendingCancellations = async () => {
  try {
    const response = await apiClientWithAuth.get<BookingListResponse>(
      `${photographerBookingBaseUrl}/pending-cancellations`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getUpcomingBookings = async () => {
  try {
    const response = await apiClientWithAuth.get<BookingListResponse>(
      `${photographerBookingBaseUrl}/upcoming`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getPastBookings = async () => {
  try {
    const response = await apiClientWithAuth.get<BookingListResponse>(
      `${photographerBookingBaseUrl}/upcoming`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getMyBookings = async () => {
  try {
    const response = await apiClientWithAuth.get<BookingListResponse>(
      `${photographerBookingBaseUrl}/my-bookings`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const cancelBooking = async (id: string) => {
  try {
    const response = await apiClientWithAuth.get<BookingResponse>(
      `${photographerBookingBaseUrl}/cancel/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const approveCancel = async (id: string) => {
  try {
    const response = await apiClientWithAuth.get<BookingResponse>(
      `${photographerBookingBaseUrl}/approve-cancel/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const photographerBookingService = {
  getPendingCancellations,
  getUpcomingBookings,
  getPastBookings,
  getMyBookings,
  cancelBooking,
  approveCancel,
};

export default photographerBookingService;

import apiClientWithAuth from "@/libs/apiClientWithAuth";
import { BookingListResponse, BookingProposal, BookingResponse } from "@/types";

const bookingBaseUrl = "/bookings/v1";

const createBooking = async (bookingProposal: BookingProposal) => {
  try {
    const response = await apiClientWithAuth.post<BookingResponse>(
      `${bookingBaseUrl}`,
      bookingProposal
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getPendingCancellations = async () => {
  try {
    const response = await apiClientWithAuth.get<BookingListResponse>(
      `${bookingBaseUrl}/pending-cancellations`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getUpcomingBookings = async () => {
  try {
    const response = await apiClientWithAuth.get<BookingListResponse>(
      `${bookingBaseUrl}/upcoming`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getPastBookings = async () => {
  try {
    const response = await apiClientWithAuth.get<BookingListResponse>(
      `${bookingBaseUrl}/past`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getAllBookings = async () => {
  try {
    const response = await apiClientWithAuth.get<BookingListResponse>(
      `${bookingBaseUrl}/my-bookings`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const getBooking = async (id: string) => {
  try {
    const response = await apiClientWithAuth.get<BookingResponse>(
      `${bookingBaseUrl}/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const cancelBooking = async (id: string) => {
  try {
    const response = await apiClientWithAuth.get<BookingResponse>(
      `${bookingBaseUrl}/cancel/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const approveCancelBooking = async (id: string) => {
  try {
    const response = await apiClientWithAuth.get<BookingResponse>(
      `${bookingBaseUrl}/approve-cancel/${id}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const bookingService = {
  createBooking,
  getPendingCancellations,
  getUpcomingBookings,
  getPastBookings,
  getAllBookings,
  getBooking,
  cancelBooking,
  approveCancelBooking,
};

export default bookingService;

import apiClientWithAuth from "@/libs/apiClientWithAuth";
import { BookingProposal } from "@/types/booking";
import { BookingListResponse, BookingResponse } from "@/types/response";

const photographerBookingBaseUrl = "/photographers/v1/bookings";

const getPendingCancellations = async () => {
  try {
    const { data } = await apiClientWithAuth.get<BookingListResponse>(
      `${photographerBookingBaseUrl}/pending-cancellations`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const createBooking = async (BookingProposal: BookingProposal) => {
  try {
    const { data } = await apiClientWithAuth.post<BookingResponse>(
      `${photographerBookingBaseUrl}`,
      BookingProposal
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const getUpcomingBookings = async () => {
  try {
    const { data } = await apiClientWithAuth.get<BookingListResponse>(
      `${photographerBookingBaseUrl}/upcoming`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const getPastBookings = async () => {
  try {
    const { data } = await apiClientWithAuth.get<BookingListResponse>(
      `${photographerBookingBaseUrl}/upcoming`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const getOneBooking = async (id: string) => {
  try {
    const { data } = await apiClientWithAuth.get<BookingResponse>(
      `${photographerBookingBaseUrl}/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const getMyBookings = async () => {
  try {
    const { data } = await apiClientWithAuth.get<BookingListResponse>(
      `${photographerBookingBaseUrl}/my-bookings`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const cancelBooking = async (id: string) => {
  try {
    const { data } = await apiClientWithAuth.get<BookingResponse>(
      `${photographerBookingBaseUrl}/cancel/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const approveCancel = async (id: string) => {
  try {
    const { data } = await apiClientWithAuth.get<BookingResponse>(
      `${photographerBookingBaseUrl}/approve-cancel/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const photographerBookingService = {
  getPendingCancellations,
  createBooking,
  getUpcomingBookings,
  getPastBookings,
  getOneBooking,
  getMyBookings,
  cancelBooking,
  approveCancel,
};

export default photographerBookingService;

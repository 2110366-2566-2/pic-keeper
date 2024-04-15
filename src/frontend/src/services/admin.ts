import {
  BookingListResponse,
  BookingResponse,
  SuccessResponse,
  UserListResponse,
  UserResponse,
} from "@/types/response";
import apiClientWithAuth from "@/libs/apiClientWithAuth";
import { Issue, IssueFilter, IssueHeaderMetadata } from "@/types/issue";
import { VerificationTicket } from "@/types/verification";

const adminBaseUrl = "/admin/v1";

const listPendingPhotographer = async () => {
  try {
    const { data } = await apiClientWithAuth.get<
      SuccessResponse<VerificationTicket[]>
    >(`${adminBaseUrl}/pending-photographers`);
    return data;
  } catch (error) {
    throw error;
  }
};
1;
const verify = async (id: string) => {
  try {
    const { data } = await apiClientWithAuth.put<UserResponse>(
      `${adminBaseUrl}/verify/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const reject = async (id: string) => {
  try {
    const { data } = await apiClientWithAuth.put<UserResponse>(
      `${adminBaseUrl}/reject/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const listPendingRefundBookings = async () => {
  try {
    const { data } = await apiClientWithAuth.get<BookingListResponse>(
      `${adminBaseUrl}/pending-refund-bookings`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const rejectRefundBookings = async (id: string) => {
  try {
    const { data } = await apiClientWithAuth.put<BookingResponse>(
      `${adminBaseUrl}/bookings/reject/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const approveRefundBooking = async (id: string) => {
  try {
    const { data } = await apiClientWithAuth.put<BookingResponse>(
      `${adminBaseUrl}/bookings/refund/${id}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const GetIssuesWithOption = async (issueFilter: IssueFilter) => {
  try {
    const queryParams = new URLSearchParams();
    Object.entries(issueFilter).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
    const { data } = await apiClientWithAuth.get<SuccessResponse<Issue[]>>(
      `${adminBaseUrl}/issues?${queryParams.toString()}`
    );
    return data;
  } catch (error) {
    throw error;
  }
};

const GetIssueHeaderMetadata = async () => {
  try {
    const { data } = await apiClientWithAuth.get<
      SuccessResponse<IssueHeaderMetadata>
    >(`${adminBaseUrl}/issue-header`);
    return data;
  } catch (error) {
    throw error;
  }
};

const adminService = {
  listPendingPhotographer,
  verify,
  reject,
  listPendingRefundBookings,
  rejectRefundBookings,
  approveRefundBooking,
  GetIssuesWithOption,
  GetIssueHeaderMetadata,
};

export default adminService;

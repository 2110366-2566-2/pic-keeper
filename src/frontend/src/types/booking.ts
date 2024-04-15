import { Gallery } from "./gallery";
import { Room } from "./room";

export enum BookingStatus {
  BookingDraftStatus = "DRAFT",
  BookingPaidStatus = "USER_PAID",
  BookingCancelledStatus = "CANCELLED",
  BookingCustomerReqCancelStatus = "C_REQ_CANCEL",
  BookingPhotographerReqCancelStatus = "P_REQ_CANCEL",
  BookingCompletedStatus = "COMPLETED",
  BookingPaidOutStatus = "PAID_OUT",
  BookingRefundReqStatus = "REQ_REFUND",
}

export interface BookingProposal {
  customer_id: string;
  room_id: string;
  negotiated_price: number;
  start_time: string;
  end_time: string;
}

export interface Booking {
  id: string;
  customer_id: string;
  room: Room;
  resulted_price: number;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
}

export enum BookingStatus {
  BookingPaidStatus = "USER_PAID",
  BookingCancelledStatus = "CANCELLED",
  BookingCustomerReqCancelStatus = "C_REQ_CANCEL",
  BookingPhotographerReqCancelStatus = "P_REQ_CANCEL",
  BookingCompletedStatus = "COMPLETED",
  BookingPaidOutStatus = "PAID_OUT",
}

export interface BookingProposal {
  gallery_id: string;
  start_time: string;
  end_time: string;
}

export interface Booking {
  id: string;
  customer_id: string;
  gallery_id: string;
  start_time: string;
  end_time: string;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
}

import { User } from "next-auth";
import { Booking } from "./booking";

export interface ReviewInput {
  booking_id: string;
  rating: string;
  review_text: string;
}

export interface Review {
  id: string;
  customer: User;
  booking: Booking;
  rating: number;
  review_text: string;
}

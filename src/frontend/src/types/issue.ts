import { User } from "next-auth";
import { Booking } from "./booking";

export enum IssueStatus {
  Open = "OPEN",
  Closed = "CLOSED",
}

export enum IssueSubject {
  Refund = "REFUND",
  Technical = "TECHNICAL",
}

export interface Issue {
  id: string;
  reporterId: string;
  reporter: User;
  bookingId?: string;
  booking?: Booking;
  status: string;
  subject: string;
  due_date: Date;
  description: string;
  created_at: Date;
}

export interface IssueInput {
  description?: string;
}

export interface IssueFilter {
  reporterId?: string;
  status?: string;
  dueDate?: Date;
  createdAt?: Date;
  subject?: string;
}

export interface IssueHeaderMetadata {
  pending_tickets: number;
  tickets_today: number;
  tickets_dueToday: number;
  closed_tickets: number;
}

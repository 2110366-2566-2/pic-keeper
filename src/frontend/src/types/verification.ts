import { User } from "./user";

export interface VerificationTicket {
  id: string;
  userId: string;
  user: User;
  idCardNumber: string;
  idCardPictureKey: string;
  idCardPictureURL: string;
  additionalDescription?: string;
  createdAt: string;
  dueDate: string;
}

export interface VerificationTicketInput {
  idCardNumber: string;
  idCardPicture: File;
  additionalDescription?: string;
}


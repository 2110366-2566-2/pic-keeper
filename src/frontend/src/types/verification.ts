import { User } from "./user";

export interface VerificationTicket {
  id: string;
  userId: string;
  user: User;
  id_card_number: string;
  id_card_pictureKey: string;
  id_card_picture_url: string;
  additional_desc?: string;
  createdAt: string;
  dueDate: string;
}

export interface VerificationTicketInput {
  idCardNumber: string;
  idCardPicture: File;
  additionalDescription?: string;
}


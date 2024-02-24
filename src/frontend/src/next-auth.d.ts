import { UUID } from "crypto";
import NextAuth from "next-auth";
import { Status, User } from "./types";

declare module "next-auth" {
  interface Session {
    user: {
      data: User;
      profile_picture_url: "";
      status: Status;
      session_token: string;
    };
  }
}

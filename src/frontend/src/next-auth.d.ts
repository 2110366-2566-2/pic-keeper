import { UUID } from "crypto";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      session_token: UUID;
      status: string;
      profile_picture_url: string;
      name: string;
      provider: string;
      id: UUID;
    };
  }
}

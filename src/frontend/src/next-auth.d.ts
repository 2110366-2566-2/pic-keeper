import { UUID } from "crypto";
import NextAuth from "next-auth";
import { User } from "./types/user";
import { LoginResponse } from "./types/response";

declare module "next-auth" {
  interface Session {
    user: LoginResponse;
  }
}

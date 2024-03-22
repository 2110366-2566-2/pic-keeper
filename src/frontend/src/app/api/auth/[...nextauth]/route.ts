import authService from "@/services/auth";
import userService from "@/services/user";
import axios, { AxiosError } from "axios";
import NextAuth from "next-auth";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { parse } from "cookie";
import adminService from "@/services/admin";
import { Role } from "@/types/user";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: { label: "Email", type: "email", placeholder: "email" },
        password: { label: "Password", type: "password" },
        role: {
          label: "Role",
          type: "text",
          placeholder: "user/admin (leave empty for Google login)",
        },
      },
      async authorize(credentials, req) {
        if (!credentials) return null;

        const loginType = credentials.role ? credentials.role : "google";

        switch (loginType) {
          case Role.User:
            try {
              const user = await authService.login({
                email: credentials.email,
                password: credentials.password,
              });
              if (user) {
                return { ...user, role: credentials.role };
              }
            } catch (error) {
              if (error instanceof AxiosError) {
                throw new Error(
                  error.response?.data.error || "Authentication failed"
                );
              } else {
                throw new Error("An unexpected error occurred");
              }
            }
            break;

          case "google":
            // Attempt Google login via cookie
            const cookies = parse(req.headers?.cookie || "");
            const sessionToken = cookies["session_token"];

            if (sessionToken) {
              try {
                const axiosInstance = axios.create({
                  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
                  headers: { Authorization: `Bearer ${sessionToken}` },
                });
                const { data: userProfile } = await axiosInstance.get(
                  `/users/v1/get-my-user-info`
                );
                return userProfile
                  ? { ...userProfile, session_token: sessionToken }
                  : null;
              } catch (error) {
                if (error instanceof AxiosError) {
                  throw new Error(
                    error.response?.data.error || "Google Authentication failed"
                  );
                } else {
                  throw new Error(
                    "An unexpected error occurred during Google authentication"
                  );
                }
              }
            }
            break;
          default:
            // If the case does not match any of the above, return null
            return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  session: { strategy: "jwt", maxAge: 60 * 60 },
  callbacks: {
    async jwt({ token, trigger, session, user }) {
      if (trigger === "update" && session.user) {
        return {
          ...token,
          ...session.user,
        };
      }
      return { ...token, ...user };
    },
    async session({ session, token, user }) {
      session.user = token as any;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

import authService from "@/services/auth";
import userService from "@/services/user";
import axios, { AxiosError } from "axios";
import NextAuth from "next-auth";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { parse } from "cookie";

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
      },
      async authorize(credentials, req) {
        if (!credentials) return null;
        if (credentials.email && credentials.password) {
          try {
            const user = await authService.login({
              email: credentials.email,
              password: credentials.password,
            });
            if (user) {
              return user as any;
            }
          } catch (error) {
            if (error instanceof AxiosError) {
              console.log(error.response?.data);
            } else {
              console.log(error);
            }
          }

          // Attempt to authenticate using a cookie if credentials are not provided
        } else {
          const cookies = parse(req.headers?.cookie || ""); // Safely parse cookies
          const sessionToken = cookies["session_token"];

          if (sessionToken) {
            // Retrieve user information
            const axiosInstance = axios.create({
              baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
              headers: { Authorization: `Bearer ${sessionToken}` },
            });
            try {
              const { data: userProfile } = await axiosInstance.get(
                `/users/v1/get-my-user-info`
              );
              return userProfile
                ? { ...userProfile, session_token: sessionToken }
                : null;
            } catch (error) {
              if (error instanceof AxiosError) {
                console.log(error.response?.data);
              } else {
                console.log(error);
              }
              return null;
            }
          }
        }
        // If neither method succeeds, return null to indicate authentication failure
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
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

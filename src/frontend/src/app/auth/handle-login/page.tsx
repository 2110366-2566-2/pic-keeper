"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

const HandleLogin = () => {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    // Check if the user is already authenticated
    if (session) {
      router.replace("/"); // Redirect to home if already logged in
      return;
    }

    const initiateLogin = async () => {
      const result = await signIn("credentials", {
        redirect: false,
        callbackUrl: "/",
      });
      if (result?.url) {
        // Successfully authenticated, redirect to the callbackUrl or home
        router.replace(result.url);
      } else {
        // Handle failed login attempt, maybe redirect to login page or show an error
        router.replace("/auth/login");
      }
    };

    initiateLogin();
  }, [router, session]);

  return (
    <div>Loading...</div> // Show a loading message or spinner while processing
  );
};

export default HandleLogin;

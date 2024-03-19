"use client";
import NavBar from "@/components/shared/Navbar/Navbar";
import userService from "@/services/user";
import { useSession } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  const fetchUserInfo = async () => {
    const response = await userService.getMyUserInfo();
    console.log(response);
  };
  fetchUserInfo();
  return (
    <main>
      <div className="">Pic-Keeper</div>
    </main>
  );
}

"use client";
import NavBar from "@/components/shared/Navbar";
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
      <NavBar />
      <div className="">Pic-Keeper</div>
    </main>
  );
}

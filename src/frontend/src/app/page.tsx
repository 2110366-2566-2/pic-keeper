"use client";
import NavBar from "@/components/Navbar";
import userService from "@/services/user";
import { useEffect } from "react";

export default function Home() {
  const handleClick = async () => {
    console.log("here");
    try {
      const response = await userService.getUserById(
        "04615383-1c27-404c-9bb7-f4ffabff9700"
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main>
      <NavBar />
      <div className="" onClick={handleClick}>
        Pic-Keeper
      </div>
    </main>
  );
}

"use client";
import NavBar from "@/components/Navbar";
import userService from "@/services/user";
import axios from "axios";
import { useEffect } from "react";

export default function Home() {
  const handleOnClick = () => {
    axios.post("/api/auth/signout");
  };
  useEffect(() => {
    console.log("yeahh mounted");
    return () => {
      console.log("unmounteddd");
    };
  });
  return (
    <main>
      <NavBar />
      <div className="" onClick={handleOnClick}>
        Pic-Keeper
      </div>
    </main>
  );
}

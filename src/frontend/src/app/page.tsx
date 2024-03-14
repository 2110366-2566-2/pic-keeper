"use client";
import NavBar from "@/components/Navbar";
import userService from "@/services/user";
import axios from "axios";
import { useEffect } from "react";
import CreateGallery from "@/components/CreateGallery";


export default function Home() {
  const handleOnClick = () => {
    axios.post("/api/auth/signout");
  };
  return (
    <main>
      <NavBar />
      <div className="" onClick={handleOnClick}>
        Pic-Keeper
      </div>
    </main>
  );
}

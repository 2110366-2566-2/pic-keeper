"use client";
import React from "react";
import axios from "axios";
import Landing from "@/components/Landing";

export default function Home() {

  const handleOnClick = () => {
    axios.post("/api/auth/signout");
  };

  return (
    <main>
      <Landing/>
    </main>
  );
}

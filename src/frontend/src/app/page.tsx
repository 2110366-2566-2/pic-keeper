"use client";
import React from "react";
import axios from "axios";
import Landing from "@/components/Landing";
import ReportIssue from "@/components/Popup/ReportIssue";

export default function Home() {

  const handleOnClick = () => {
    axios.post("/api/auth/signout");
  };

  return (
    <main>
      {/* <Landing/> */}
      <ReportIssue />
    </main>
  );
}

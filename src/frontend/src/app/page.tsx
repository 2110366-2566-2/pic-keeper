"use client";
import React from "react";
import NavBar from "@/components/Navbar";
import { useSession } from "next-auth/react";
import GalleryComponent from "@/components/Gallery";
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
      <div className="container mx-auto p-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <GalleryComponent
            GalleryName={"Myself"}
            Images={["/images/image1.jpg", "/images/image2.jpg", "/images/image3.jpg"]}
            Photographer={"Pattapon Vichanukroh"}
          />
          <GalleryComponent
            GalleryName={"Myself"}
            Images={["/images/image1.jpg", "/images/image2.jpg", "/images/image3.jpg"]}
            Photographer={"Myname"}
          />
          <GalleryComponent
            GalleryName={"Myself"}
            Images={["/images/image1.jpg", "/images/image2.jpg", "/images/image3.jpg"]}
            Photographer={"Myname"}
          />
        </div>
      </div>
    </main>
  );
}

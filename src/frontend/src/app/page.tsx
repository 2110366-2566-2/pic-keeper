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

  // This will list of GalleryComponent that get from backend
  const GalleryComponentList = [] 

  return (
    <main>
      <NavBar />
      {/* This part is sidebar */}

      {/* This is section of displayed gallery view */}
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <GalleryComponent
            GalleryName={"MyDickIsBig"}
            Images={["/images/image1.jpg"]}
            Photographer={"Pattapon Vichanukroh"}
            Price={1290}
          />
          <GalleryComponent
            GalleryName={"PussyTight"}
            Images={["/images/image1.jpg", "/images/image2.jpg"]}
            Photographer={"Joel Biden"}
            Price={1599}
          />
          <GalleryComponent
            GalleryName={"dickBigPussyTight"}
            Images={["/images/image1.jpg", "/images/image2.jpg", "/images/image3.jpg"]}
            Photographer={"Osama Bin Laden"}
            Price={1000}
          />
          <GalleryComponent
            GalleryName={"IWantChildren"}
            Images={["/images/image1.jpg", "/images/image3.jpg"]}
            Photographer={"Osama Bin Laden"}
            Price={1000}
          />
          <GalleryComponent
            GalleryName={"dickBigPussyTight"}
            Images={["/images/image1.jpg", "/images/image2.jpg", "/images/image3.jpg"]}
            Photographer={"Osama Bin Laden"}
            Price={1000}
          />
        </div>
      </div>
    </main>
  );
}

"use client";
import userService from "@/services/user";
import Link from "next/link";
import Image from "next/image";
import customerGalleriesService from "@/services/customerGalleries";
import GalleryComponent from "@/components/Gallery";
import { useEffect, useState } from "react";
import { User } from "@/types/user";
import { profile } from "console";
import { useSession } from "next-auth/react";
import { capitalizeFirstLetter } from "@/utils/string";
import { MdEdit } from "react-icons/md";
import { SearchFilter } from "@/types/gallery";
import { Gallery } from "@/types/gallery";
import ProfileInfo from "@/components/User/ProfileView/ProfileInfo";
const Home = ({ params }: { params: { userId: string } }) => {
  return (
    <div className="">
      <ProfileInfo params={params} />
    </div>
  );
};

export default Home;

"use client";
import userService from "@/services/user";
import { useEffect, useState } from "react";
import { User } from "@/types/user";
import { profile } from "console";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { capitalizeFirstLetter } from "@/utils/string";

const Home = ({ params }: { params: { userId: string } }) => {
  const { data: session } = useSession();
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  return (
    <main className="m-8 space-y-6">
      <div className="text-2xl font-semibold px-5">Profile</div>
      <div className="w-full rounded-md h-28 shadow-md space-x-2 relative flex flex-row">
        <div className="bg-gray-300 rounded-full w-24 h-24 justify-items-center ml-10 mr-5">
          {photoPreview && (
            <Image
              src={photoPreview}
              alt="Profile Preview"
              fill={true}
              className="rounded-full object-cover" // Make the image circular
            />
          )}
        </div>
        <div className="flex flex-col col-span-4">
          <div className="flex flex-row space-x-3">
            <div className="text-xl">{session?.user.data?.username}</div>
            {session?.user.data?.verification_status === "VERIFIED" ? (
              <div className="p-1 bg-neutral-300 rounded-2xl text-neutral-500 text-xs">
                Photograher
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="flex flex-row space-x-2">
            <div className="text-xl">{session?.user.data?.firstname}</div>
            <div className="text-xl">{session?.user.data?.lastname}</div>
          </div>
          <div className="text-sm text-gray-500">
            {(session?.user.data &&
              capitalizeFirstLetter(session.user.data.gender)) ||
              "Not specified"}
          </div>
        </div>
        <Link
          href="/user/edit-profile"
          className="bg-amber-500 rounded-md text-white p-2 px-5 absolute bottom-4 right-4"
        >
          Edit
        </Link>
      </div>
      <div className="flex flex-row space-x-6">
        <div className="w-3/12 shadow-md rounded-md p-4 space-y-4">
          <div className="text-xl font-semibold text-amber-500">About</div>
          <article className="text-wrap text-md text-gray-600">
            <p>{session?.user.data?.about || "No description provided"}</p>
          </article>
          <div className="text-xl font-semibold text-amber-500">Location</div>
          <article className="text-wrap text-md text-gray-600">
            <p>{session?.user.data?.address || "No description provided"}</p>
          </article>
          <div className="text-xl font-semibold text-amber-500">Contact</div>
          <article className="text-wrap text-md text-gray-600">
            <p>{session?.user.data?.email || ""}</p>
            <p>{session?.user.data?.phone_number || "No description provided"}</p>
          </article>
        </div>
        <div className="w-9/12 shadow-md rounded-md">
          <div className="text-amber-500 font-semibold text-xl p-4">
            Galleries
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;

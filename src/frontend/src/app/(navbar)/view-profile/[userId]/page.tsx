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

const Home = ({ params }: { params: { userId: string } }) => {
  const { data: session } = useSession();
  const [profilePicture, setProfilePicture] = useState("");
  const [listOfGalleries, setListOfGalleries] = useState<Gallery[]>([]);
  const searchFilter: SearchFilter = { photographer_id: params.userId };

  useEffect(() => {
    const fetchAllGalleries = async () => {
      const response = await customerGalleriesService.search(searchFilter);
      if (response.data) setListOfGalleries(response.data);
      // console.log(response);
    };

    fetchAllGalleries();
  }, []);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await userService.getMyUserInfo();
        if (response.data) {
          setProfilePicture(response.profile_picture_url ?? "");
        }
      } catch (error) {
        console.log("error");
      }
    };

    fetchUserInfo();
  }, [session]);

  return (
    <main className="m-4 sm:m-8 space-y-6">
      <div className="text-2xl font-semibold px-5">Profile</div>
      <div className="w-full rounded-md shadow-md relative p-4 sm:space-x-2 sm:p-0 sm:flex sm:flex-row sm:h-28">
        <div className="flex justify-center w-full sm:w-auto">
          <div className="relative bg-gray-300 rounded-full w-24 h-24 justify-items-center sm:ml-10 sm:mr-5">
            <Image
              className="object-cover rounded-full"
              fill={true}
              src={session ? profilePicture : "/images/no-picture.jpeg"}
              alt=""
            />
          </div>
        </div>
        <div className="flex flex-col col-span-4 space-y-1">
          <div className="flex flex-row space-x-3">
            <div className="text-xl font-semibold">
              {session?.user.data?.username}
            </div>
            {session?.user.data?.verification_status === "VERIFIED" ? (
              <div className="p-1 bg-neutral-300 rounded-2xl text-neutral-500 text-xs h-6 mt-1">
                Photograher
              </div>
            ) : (
              ""
            )}
          </div>
          <div className="flex flex-row space-x-2">
            <div className="text-xl font-semibold">
              {session?.user.data?.firstname}
            </div>
            <div className="text-xl font-semibold">
              {session?.user.data?.lastname}
            </div>
          </div>
          <div className="text-sm text-gray-500">
            {(session?.user.data &&
              capitalizeFirstLetter(session.user.data.gender)) ||
              "Not specified"}
          </div>
        </div>
        <Link
          href="/settings/edit-profile"
          className="bg-amber-500 rounded-md text-white p-2 px-3 absolute bottom-4 right-4 flex flex-row"
        >
          Edit
        </Link>
      </div>
      <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-6 sm:space-y-0">
        <div className="w-full shadow-md rounded-md p-4 space-y-4 sm:w-3/12">
          <div className="text-xl font-semibold text-amber-500">About</div>
          <article className="text-wrap text-md text-gray-600">
            <p>{session?.user.data?.about || "No description provided"}</p>
          </article>
          <div className="text-xl font-semibold text-amber-500">Location</div>
          <article className="text-wrap text-md text-gray-600">
            <p>{session?.user.data?.address || "No description provided"}</p>
          </article>
          <div className="text-xl font-semibold text-amber-500">Contact</div>
          <article className="text-wrap sm:truncate text-md text-gray-600">
            <p>{session?.user.data?.email || ""}</p>
            <p>
              {session?.user.data?.phone_number || "No description provided"}
            </p>
          </article>
        </div>
        <div className="w-full sm:w-9/12 shadow-md rounded-md">
          <div className="text-amber-500 font-semibold text-xl p-4">
            Galleries
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {/* GALLERY COMPONENT */}
            {listOfGalleries &&
              listOfGalleries.map((Gallery, index) => (
                <GalleryComponent
                  key={index}
                  galleryId={Gallery.id}
                  galleryName={Gallery.name}
                  galleryLocation={Gallery.location}
                  photographerId={Gallery.photographer_id}
                  price={Gallery.price}
                />
              ))}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Home;

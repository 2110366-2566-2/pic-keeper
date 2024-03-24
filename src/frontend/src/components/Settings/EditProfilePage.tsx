"use client";

import useApiWithAuth from "@/hooks/useApiWithAuth";
import { useErrorModal } from "@/hooks/useErrorModal";
import userService from "@/services/user";
import { UploadProfilePictureResponse } from "@/types/response";
import { Gender, UserUpdateInput } from "@/types/user";
import axios from "axios";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { MdEdit } from "react-icons/md";

const EditProfilePage = () => {
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [gender, setGender] = useState<Gender | undefined>(undefined);
  const [about, setAbout] = useState("");
  const [username, setUsername] = useState("");
  const [address, setAddress] = useState("");

  const apiClientForForm = useApiWithAuth();
  const { data: session, update } = useSession();
  const showError = useErrorModal();

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const userInfo = await userService.getMyUserInfo();
        // Assume userInfo.data has the user info based on your API's response structure
        setName(userInfo.data?.firstname || "");
        setSurname(userInfo.data?.lastname || "");
        setGender(userInfo.data?.gender || undefined);
        setAbout(userInfo.data?.about || "");
        setUsername(userInfo.data?.username || "");
        setAddress(userInfo.data?.address || "");
        setPhotoPreview(userInfo.profile_picture_url || "");
      } catch (error) {
        showError(error, "Failed to fetch user Info");
      }
    };

    fetchUserInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditPhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setPhoto(file);

    // Create url for preview
    if (file) {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
      const fileUrl = URL.createObjectURL(file);
      setPhotoPreview(fileUrl);
    } else {
      setPhotoPreview(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Construct user update input object
    const userUpdateInput: UserUpdateInput = {
      firstname: name,
      lastname: surname,
      gender,
      about,
      username,
      address,
    };

    try {
      // Update user profile
      const updatedUser = await userService.updateUserProfile(userUpdateInput);
      // Upload profile picture if it has been changed
      if (session) {
        const updatedSession = {
          ...session,
          user: { ...session.user, data: updatedUser.data },
        };
        await update(updatedSession);
      }
      if (photo) {
        const updatedPhoto = await userService.uploadProfile(
          apiClientForForm,
          photo
        );
        if (session) {
          const updatedSession = {
            ...session,
            user: {
              ...session.user,
              profile_picture_url: updatedPhoto.profile_picture_url,
            },
          };
          await update(updatedSession);
        }
      }
    } catch (error) {
      showError(error, "Failed to update profile");
    }
  };

  useEffect(() => {
    // This function is called only when the component unmounts
    return () => {
      if (photoPreview) {
        URL.revokeObjectURL(photoPreview);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <form className="h-full w-full m-auto" onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="border-b border-gray-900/10 pb-4">
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-6 gap-x-6 gap-y-3">
            <div className="sm:col-span-4">
              <h2 className="text-title">Edit profile</h2>
              <p className="text-standard text-gray-700">
                Information you add here is visible to any who can view your
                profile
              </p>
            </div>
            <div className="sm:col-span-4">
              <label htmlFor="photo" className="label-normal">
                Photo
              </label>
              <div className="relative w-fit">
                <div className="bg-gray-300 rounded-full w-24 h-24">
                  {photoPreview && (
                    <Image
                      src={photoPreview}
                      alt="Profile Preview"
                      fill={true}
                      className="rounded-full object-cover" // Make the image circular
                    />
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleEditPhotoClick}
                  className="absolute bottom-0 right-0 bg-amber-400 p-1 rounded-full"
                  aria-label="Edit photo"
                >
                  {/* Replace with an edit icon */}
                  <MdEdit />
                </button>
              </div>
              <input
                id="photo"
                type="file"
                ref={fileInputRef}
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
            <div className="sm:col-span-3">
              <label htmlFor="name" className="label-normal">
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Name"
                className="form-input mt-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="sm:col-span-3">
              <label htmlFor="surname" className="label-normal">
                Surname
              </label>
              <input
                id="surname"
                type="text"
                placeholder="Surname"
                className="form-input mt-2"
                value={surname}
                onChange={(e) => setSurname(e.target.value)}
              />
            </div>
            <div className="sm:col-span-3">
              <label className="label-normal">Gender</label>
              <div className="flex gap-4 pl-2 mt-2">
                {Object.keys(Gender).map((key) => (
                  <div key={key} className="space-x-3">
                    <input
                      type="radio"
                      value={Gender[key as keyof typeof Gender]}
                      checked={gender === Gender[key as keyof typeof Gender]}
                      onChange={(e) => setGender(e.target.value as Gender)}
                    />
                    <label>{key}</label>
                  </div>
                ))}
              </div>
            </div>
            <div className="sm:col-span-5">
              <label className="label-normal">About</label>
              <textarea
                rows={4}
                className="form-input mt-2"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
              />
            </div>
            <div className="sm:col-span-3">
              <label htmlFor="username" className="label-normal">
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Username"
                className="form-input mt-2"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="sm:col-span-4">
              <label htmlFor="address" className="label-normal">
                Location
              </label>
              <input
                id="address"
                type="text"
                placeholder="Location"
                className="form-input mt-2"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="mt-2 flex items-center justify-end gap-x-6">
          <button
            type="button"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="rounded-md bg-amber-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-amber-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-600"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditProfilePage;

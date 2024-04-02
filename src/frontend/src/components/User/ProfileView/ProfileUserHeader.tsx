import { Session } from "next-auth"
import { capitalizeFirstLetter } from "@/utils/string";
import Image from "next/image";
import Link from "next/link";

const ProfileUserHeader = ({ session , profilePicture , userId}: { session: Session | null , profilePicture: string , userId: string}) => {
  return (
    <div className="w-full rounded-md shadow-md relative p-4 sm:space-x-2 sm:p-0 sm:flex sm:flex-row sm:h-28">
      <div className="flex justify-center w-full sm:w-auto">
        <div className="relative bg-gray-300 rounded-full w-24 h-24 justify-items-center sm:ml-10 sm:mr-5">
          <Image
            className="object-cover rounded-full"
            fill={true}
            src={
              session
                ? profilePicture === ""
                  ? "/images/no-picture.jpeg"
                  : profilePicture
                : "/images/no-picture.jpeg"
            }
            alt={`Profile picture of ${session?.user?.data?.username}`}
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
              Photographer
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
          {session?.user.data?.gender
            ? capitalizeFirstLetter(session.user.data.gender)
            : "Not specified"}
        </div>
      </div>
      {session?.user.data?.id === userId ? (
        <Link
          href="/settings/edit-profile"
          className="bg-amber-500 rounded-md text-white p-2 px-3 absolute bottom-4 right-4 flex flex-row"
        >
          Edit
        </Link>
      ) : null}
    </div>
  );
};

export default ProfileUserHeader;

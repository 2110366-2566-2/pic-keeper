import { Session } from "next-auth";

const ProfileInfo = ({session} : {session : Session | null}) => {
  return (
    <div className="w-full h-min shadow-md rounded-md p-4 space-y-4 sm:w-3/12">
      <div className="text-xl font-semibold text-amber-500">About</div>
      <article className="text-wrap text-md text-gray-600">
        <p>{session?.user.data?.about || "No description provided"}</p>
      </article>
      <div className="text-xl font-semibold text-amber-500">Location</div>
      <article className="text-wrap text-md text-gray-600">
        <p>{session?.user.data?.address || "No Location provided"}</p>
      </article>
      <div className="text-xl font-semibold text-amber-500">Contact</div>
      <article className="text-wrap sm:truncate text-md text-gray-600">
        <p>{session?.user.data?.email || "No contact provided"}</p>
        <p>{session?.user.data?.phone_number || ""}</p>
      </article>
    </div>
  );
};

export default ProfileInfo;

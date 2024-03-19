'use client'
import userService from '@/services/user'
import { useEffect, useState } from 'react';
import { User } from '@/types/user'
import { profile } from 'console';
import { useSession } from 'next-auth/react';

const Home = ({params} : {params: { userId : string}}) => {

  const [profileUser, setProfileUser] = useState<User>()

  useEffect(() => {
    const fetchUser = async () => {
      const response = await userService.getUserById(params.userId)
      if (response.data)  setProfileUser(response.data)
    }
    fetchUser();
  }, [])
  return (
    <main>
      Profile
      <div className="w-full rounded-md h-32 shadow-md space-x-2 grid grid-cols-7 relative">
        <div className="rounded-full bg-black">PIC</div>
        <div className="flex flex-col col-span-5">
          <div className="text-2xl">{profileUser?.username}</div>
          <div className="flex flex-row space-x-2">
            <div className="text-xl">{profileUser?.firstname}</div>
            <div className="text-xl">{profileUser?.lastname}</div>
          </div>
          <div className=""></div>
        </div>
        <button className="bg-amber-500 rounded-md text-white p-2 px-5 absolute bottom-4 right-4">
          Edit
        </button>
      </div>
    </main>
  );
};

export default Home;

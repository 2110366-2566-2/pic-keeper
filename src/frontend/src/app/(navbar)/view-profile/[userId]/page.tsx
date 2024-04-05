"use client";
import Profile from "@/components/User/ProfileView/Profile";
const Home = ({ params }: { params: { userId: string } }) => {
  return (
    <div className="">
      <Profile params={params} />
    </div>
  );
};

export default Home;

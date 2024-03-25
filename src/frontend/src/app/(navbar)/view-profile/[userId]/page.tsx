"use client";
import ProfileInfo from "@/components/User/ProfileView/ProfileInfo";
const Home = ({ params }: { params: { userId: string } }) => {
  return (
    <div className="">
      <ProfileInfo params={params} />
    </div>
  );
};

export default Home;

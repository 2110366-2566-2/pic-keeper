import ChatSystem from "@/components/ChatSystem";
import NavBar from "@/components/Navbar";

const Home = () => {
  return (
    <div className="w-screen h-screen">
      <NavBar />
        <div className="flex h-full">
          <ChatSystem />
        </div>
    </div>
  );
};

export default Home;

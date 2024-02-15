import AccountManage from "@/components/AccountManage"
import NavBar from "@/components/Navbar";

const Home = () => {
  return (
    <div className="w-screen h-screen">
      <NavBar />
      <div className="max-w-4xl m-auto">
        <AccountManage />
      </div>
    </div>
  );
};

export default Home;

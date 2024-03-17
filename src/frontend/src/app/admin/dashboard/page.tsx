import { Header, Verification } from "@/components/Admin";
import SideNavbar from "@/components/User/MyGalleries/SideNavbar";

function Dashboard() {
  return (
    <>
      <div className="min-h-screen bg-gray-100 flex">
        <SideNavbar />
        <main className="w-screen">
          <Header />
          <div className="p-4">
            <Verification />
          </div>
        </main>
      </div>
    </>
  );
}

export default Dashboard;

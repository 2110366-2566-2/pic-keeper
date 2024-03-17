import { Header, Verification, SideNavbar } from "@/components/Admin";

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

import Sidebar from "@/components/SidebarDashBoard";
import Header from "@/components/Header";
import Verification from "@/components/Verification";

function Dashboard() {
  return (
    <>
      <div className="min-h-screen bg-gray-100 flex">
        <Sidebar />
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

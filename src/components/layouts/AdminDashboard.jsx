import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

const DashboardLayout = () => {
  return (
    <div className="bg-gray-50 min-h-screen">
      <Sidebar />

      <main className="md:ml-64 p-4 md:p-8 pb-20 md:pb-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
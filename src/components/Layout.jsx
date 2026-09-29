import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F3EE]">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="min-h-screen lg:ml-[270px]">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default Layout;
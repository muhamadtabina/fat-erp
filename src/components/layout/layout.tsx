import Navbar from "./navbar";
import AppSidebar from "./app-sidebar";
import { SidebarProvider } from "../ui/sidebar";
import { Outlet } from "react-router";

const Layout = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <main className="w-full">
        <Navbar />
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </SidebarProvider>
  );
};

export default Layout;

import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { TooltipProvider } from "@/components/ui/tooltip"
import { Toaster } from "@/components/ui/sonner"

function MainLayout() {
  return (
    <>
      <Navbar />
      <main className="p-6">
       <TooltipProvider>  

        <Outlet />
       </TooltipProvider>
        <Toaster />
      </main>
    </>
  );
}

export default MainLayout;

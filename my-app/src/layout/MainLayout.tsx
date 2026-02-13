import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { TooltipProvider } from "@/components/ui/tooltip"

function MainLayout() {
  return (
    <>
      <Navbar />
      <main className="p-6">
       <TooltipProvider>  

        <Outlet />
       </TooltipProvider>
      </main>
    </>
  );
}

export default MainLayout;

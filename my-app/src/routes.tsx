import { Routes, Route } from "react-router-dom";
import MainLayout from "@/layout/MainLayout";
import DashboardPage from "@/features/dashboard/pages/DashboardPage";

function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<DashboardPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;

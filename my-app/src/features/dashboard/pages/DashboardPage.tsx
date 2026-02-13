import {FormCard} from "../components/FormCard";
import {TaskList} from "../components/TaskList";
import { useState } from "react";
import { Button } from "@/components/ui/button";

function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-7">Dashboard</h1>
      <div className="flex items-center justify-end mb-7">
        <Button onClick={() => setIsModalOpen(true)}>Create Task</Button>
      </div>
      <div className="p-7 mt-10">
        <h1 className="text-3xl font-bold mb-7">Tasks</h1>
        <TaskList />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <FormCard onClose={() => setIsModalOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardPage;

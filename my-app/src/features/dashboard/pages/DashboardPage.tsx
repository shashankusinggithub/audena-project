import {FormCard} from "../components/FormCard";
import {TaskList} from "../components/TaskList";

function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-7">Dashboard</h1>
      <div className="flex items-center justify-center mb-7">
        <FormCard  />
      </div>
      <div className="p-7 mt-10">
        <h1 className="text-3xl font-bold mb-7">Tasks</h1>
        <TaskList />
      </div>


    </div>
  );
}

export default DashboardPage;

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TaskStatus, type Task, type TaskCreate } from "../types";
import { RefreshCcw } from "lucide-react";
import { Item, ItemMedia } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import { TooltipWrapper } from "@/components/tool-tips";
import { useTasks } from "../hooks";
import { createTask } from "@/features/dashboard/api";
import { handleTaskCreate } from "@/realtime/eventHandler";

const headers = [
  {
    label: "Full Name",
    key: "fullName",
    className: "",
  },
  {
    label: "Phone Number",
    key: "phone",
  },
  {
    label: "Workflow Type",
    key: "task",
  },
  {
    label: "Status",
    key: "status",
    className: "",
  },
];

export function SpinnerDemo() {
  return (
    <div className="">
      <Item>
        <ItemMedia>
          <Spinner />
        </ItemMedia>
      </Item>
    </div>
  );
}

function StatusCell({ work }: { work: Task }) {
  switch (work.status) {
    case TaskStatus.PENDING:
      return <TableCell className="text-yellow-500">{work.status}</TableCell>;
    case TaskStatus.QUEUED:
      return <TableCell className="text-yellow-500">{work.status}</TableCell>;
    case TaskStatus.IN_PROGRESS:
      return (
        <TableCell className="text-yellow-500 ">
          <div className="flex align-middle items-center">
          <span className="mr-2">{work.status}</span> <SpinnerDemo />

          </div>
        </TableCell>
      );
    case TaskStatus.COMPLETED:
      return <TableCell className="text-green-500">{work.status}</TableCell>;
    case TaskStatus.FAILED:
      return (
        <TableCell className="text-red-500 ">
          {work.status}{" "}
          <RefreshCcw
            className="inline-block w-4 h-4 ml-6 pointer cursor-pointer"
            onClick={() => onRetry(work)}
          />
        </TableCell>
      );
  }
}
const onRetry = async (data: Task) => {
  console.log(data);

  const task: TaskCreate = {
    customer_name: data.customer_name,
    phone_number: data.phone_number,
    workflow: data.workflow,
  };
  try {
    const newTask = await createTask(task);
    handleTaskCreate(newTask);
  } catch (error) {
    console.error("Error creating task:", error);
  }
};

export function TaskList() {
  const { data, isLoading, error } = useTasks();
  if (isLoading) return <p>Loading tasks...</p>;
  if (error instanceof Error) return <p>Error: {error.message}</p>;


  return (
    <div className="w-full overflow-auto capitalize">
      <Table className="w-full">
        <TableHeader>
          <TableRow className="w-full text-xl font-bold">
            {headers.map((header) => (
              <TableHead key={header.key} className={header.className}>
                {header.label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="">
          {data?.map((work: Task) => (
            <TableRow key={work.id} className="h-15 w-full items-center">
              <TableCell className="w-[10px] pointer cursor-pointer">
                <TooltipWrapper hoverText={work.customer_name} />
              </TableCell>
              <TableCell>{work.phone_number}</TableCell>
              <TableCell>{work.workflow}</TableCell>
              <StatusCell work={work as Task} />
              <TableCell className="text-right text-red-500">
                {work.error_message}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

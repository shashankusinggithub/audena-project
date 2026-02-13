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
import { SpinnerWrapper } from "@/components/spinner-wraper";
import { TooltipWrapper } from "@/components/tool-tips";
import { useTasks } from "../hooks";
import { createTask } from "@/features/dashboard/api";
import { handleTaskCreate } from "@/realtime/eventHandler";
import { useState } from "react";
import { PaginationWrapper } from "@/components/pagination";
import { ArrowDownWideNarrow, ArrowUpWideNarrow } from "lucide-react";
const headers = [
  {
    label: "Created At",
    key: "created_at",
    className: "w-1/7",
  },
  {
    label: "Full Name",
    key: "fullName",
    className: "w-2/7",
  },
  {
    label: "Phone Number",
    key: "phone",
    className: "w-1/7",
  },
  {
    label: "Workflow Type",
    key: "workflow",
    className: "w-1/7",
  },
  {
    label: "Status",
    key: "status",
    className: "w-2/7",
  },
];

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
            <span className="mr-2">{work.status}</span> <SpinnerWrapper />
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
            className="inline-block w-4 h-4 ml-4 pointer cursor-pointer mr-10"
            onClick={() => onRetry(work)}
          />
          {work.error_message}
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
  const [page, setPage] = useState(0);
  const [sort, setSort] = useState({
    field: "created_at",
    order: "desc",
  });
  const limit = 10;

  const { data, isLoading, error } = useTasks(
    page,
    limit,
    sort.field,
    sort.order,
  );

  // Get total from response data, default to 1 if not available
  const total = data?.total || 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  if (isLoading) return <p>Loading tasks...</p>;
  if (error instanceof Error) return <p>Error: {error.message}</p>;

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  console.log(data);
  return (
    <div className="w-full overflow-x-auto capitalize">
      <Table className="table-fixed">
        <TableHeader>
          <TableRow className=" text-xl font-bold">
            {headers.map((header) => (
              <TableHead
                key={header.key}
                onClick={() =>
                  setSort({
                    field: header.key,
                    order: sort.order === "desc" ? "asc" : "desc",
                  })
                }
                className={`
                  ${
                    sort.field === header.key
                      ? "bg-secondary flex items-center"
                      : ""
                  } 
                    ${header.className}`}
              >
                {header.label}
                {sort.field === header.key ? (
                  <span className="ml-2 inline-flex items-center">
                    {sort.order === "desc" ? (
                      <ArrowDownWideNarrow className="w-7 h-7" />
                    ) : (
                      <ArrowUpWideNarrow className="w-7 h-7" />
                    )}
                  </span>
                ) : (
                  <span className="w-7 h-7 inline-block"></span>
                )}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody className="">
          {data?.data?.map((work: Task) => (
            <TableRow key={work.id} className="h-15 items-center">
              <TableCell>
                {new Date(work.created_at).toLocaleString()}
              </TableCell>
              <TableCell className="w-[10px] pointer cursor-pointer">
                <TooltipWrapper hoverText={work.customer_name} />
              </TableCell>
              <TableCell>{work.phone_number}</TableCell>
              <TableCell>{work.workflow}</TableCell>
              <StatusCell work={work as Task} />
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <PaginationWrapper
        page={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

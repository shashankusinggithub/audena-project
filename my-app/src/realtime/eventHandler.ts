import { queryClient } from "@/lib/queryClient";
import {
  TaskStatus,
  type TasksResponse,
  type Task,
} from "@/features/dashboard/types";
import { toast } from "sonner";

export function handleTaskUpdate(payload: Task) {
  if (payload.status === TaskStatus.FAILED) {
    toast(`Task ${payload.customer_name} failed: ${payload.error_message}`, {
      position: "top-right",
    });
  } else {
    toast(`Task ${payload.customer_name} is now ${payload.status}`, {
      position: "top-right",
    });
  }

  queryClient.setQueriesData<TasksResponse>(
    { queryKey: ["tasks"] },
    (oldData) => {
      if (!oldData) return undefined;
      return {
        ...oldData,
        data: oldData.data.map((task) =>
          task.id === payload.id ? payload : task,
        ),
      };
    },
  );
}

export function handleTaskCreate(payload: Task) {
  toast(`Task ${payload.customer_name} created`, { position: "top-right" });

  queryClient.setQueriesData<TasksResponse>(
    { queryKey: ["tasks"] },
    (oldData) => {
      if (!oldData) return undefined;

      if (oldData.config.sortby === "created_at" && oldData.config.sort_order === "desc") {
        return {
          ...oldData,
          data: [payload, ...oldData.data],
          total: oldData.total + 1,
        };
      }
    },
  );
}

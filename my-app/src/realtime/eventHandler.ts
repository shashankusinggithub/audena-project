import { queryClient } from "@/lib/queryClient";
import { type Task } from "@/features/dashboard/types";

export function handleTaskUpdate(payload: Task) {
  queryClient.setQueryData<Task[]>(["tasks"], (oldData) => {
    if (!oldData) return [];
    return oldData.map((task) => (task.id === payload.id ? payload : task));
  });
}
export function handleTaskCreate(payload: Task) {
  queryClient.setQueryData<Task[]>(["tasks"], (oldData) => {
    if (!oldData) return [payload];
    return [payload, ...oldData];
  });
}



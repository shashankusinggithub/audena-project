import { useQuery } from "@tanstack/react-query";
import { fetchTasks } from "./api";
import type { Task } from "./types";

export function useTasks() {
  return useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: fetchTasks,
  });
}

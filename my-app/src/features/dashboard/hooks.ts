import { useQuery } from "@tanstack/react-query";
import { fetchTasks} from "./api";
import {type TasksResponse} from "./types";

export function useTasks(page: number = 0, limit: number = 10, sortBy: string = "created_at", sortOrder: string = "desc") {
  return useQuery<TasksResponse>({
    queryKey: ["tasks", page, limit, sortBy, sortOrder],
    queryFn: () => fetchTasks(page, limit, sortBy, sortOrder),
  });
}

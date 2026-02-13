import axios from "axios";
import { type Task, type TaskCreate, type TasksResponse } from "./types";

export const fetchTasks = async (page: number = 0, limit: number = 10, sortBy: string = "created_at", sortOrder: string = "desc"): Promise<TasksResponse> => {
  const params = new URLSearchParams({
    skip: String(page * limit),
    limit: String(limit),
    sortby: sortBy,
    sort_order: sortOrder,
  });
  const data = await axios
    .get(`${import.meta.env.VITE_API_URL}/works?${params}`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching tasks:", error);
      throw error;
    });
  return data
};

export const createTask = async (task: TaskCreate): Promise<Task> => {
  const data = await axios
    .post(`${import.meta.env.VITE_API_URL}/works`, task)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error creating task:", error);
      throw error;
    });
  return data;
};

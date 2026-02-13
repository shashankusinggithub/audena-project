import axios from "axios";
import { type Task, type TaskCreate } from "./types";

export const fetchTasks = async (): Promise<Task[]> => {
  const data = await axios
    .get(`${import.meta.env.VITE_API_URL}/works/`)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error fetching tasks:", error);
      throw error;
    });
  return data;
};

export const createTask = async (task: TaskCreate): Promise<Task> => {
  const data = await axios
    .post(`${import.meta.env.VITE_API_URL}/works/`, task)
    .then((response) => response.data)
    .catch((error) => {
      console.error("Error creating task:", error);
      throw error;
    });
  return data;
};

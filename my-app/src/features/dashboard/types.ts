export interface Task extends TaskCreate {
  id: string;
  status: TaskStatus;
  error_message: string;
  created_at: string;
}

import { z } from "zod";

export const taskCreateSchema = z.object({
  customer_name: z.string().min(3, "Customer name is required"),
  phone_number: z.string().min(10, "Phone number must be at least 10 digits").regex(/^\d+$/, "Phone number must contain only digits"),
  workflow: z.enum(["support", "sales", "reminder"]),
});

export type TaskCreate = z.infer<typeof taskCreateSchema>;

export enum TaskStatus {
  PENDING = "pending",
  QUEUED = "queued",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  FAILED = "failed",
}

export enum WorkflowType {
  SUPPORT = "support",
  SALES = "sales",
  REMINDER = "reminder",
}




export interface TasksResponse {
  data: Task[] | [];
  total: number;
  config: {
    skip: number;
    limit: number;
    sortby: string;
    sort_order: string;
  };
}
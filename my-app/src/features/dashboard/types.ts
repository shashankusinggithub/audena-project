export interface Task extends TaskCreate {
  id: string;
  status: TaskStatus;
  error_message: string;
}

export interface TaskCreate {
  customer_name: string;
  phone_number: string;
  workflow: WorkflowType;
}

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

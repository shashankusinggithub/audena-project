import { useEffect } from "react";
import { socketService } from "./socket";
import { handleTaskUpdate } from "@/realtime/eventHandler";
import { type Task } from "@/features/dashboard/types";

function dispatchMessage(message: { type: string; data?: unknown }) {
  if (message.type !== "work_update") return;
  
  const payload = message.data as Task | undefined;
  if (!payload) return;

  try {
    handleTaskUpdate(payload);
  } catch (e) {
    console.error("[SocketProvider] Error:", e);
  }
}

export function SocketProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    socketService.connect();
    return socketService.subscribe(dispatchMessage);
  }, []);

  return children;
}

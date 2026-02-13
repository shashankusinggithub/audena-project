type SocketMessage = {
  type: string;
  data?: unknown;
};

class SocketService {
  private socket: WebSocket | null = null;
  private listeners: ((data: SocketMessage) => void)[] = [];

  connect(clientId?: string) {
    if (this.socket) return;

    const id = clientId || `client_${Math.random().toString(36).substring(2, 15)}`;
    const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:8000/api/ws";
    this.socket = new WebSocket(`${wsUrl}/${id}`);

    this.socket.onopen = () => console.log("WebSocket connected");

    this.socket.onmessage = (event) => {
      try {
        const data: SocketMessage = JSON.parse(event.data);
        this.listeners.forEach((cb) => cb(data));
      } catch (e) {
        console.error("[SocketService] Parse error:", e);
      }
    };

    this.socket.onerror = () => console.error("[SocketService] WebSocket error");

    this.socket.onclose = () => {
      this.socket = null;
      setTimeout(() => this.connect(), 3000);
    };
  }

  subscribe(callback: (data: SocketMessage) => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }
}

export const socketService = new SocketService();

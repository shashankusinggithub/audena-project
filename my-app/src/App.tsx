import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import { SocketProvider } from "./infrastructure/websocket/SocketProvider";
import { ThemeProvider } from "@/components/theme-provider"


function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <SocketProvider>
          <AppRoutes />
        </SocketProvider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;

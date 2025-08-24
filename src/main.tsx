
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { WsClient, WsClientProvider } from "./components/ws-client.tsx";

const convex = new ConvexReactClient("https://enduring-anteater-146.convex.cloud");
  createRoot(document.getElementById("root")!).render(

    <WsClientProvider>
    <ConvexProvider client={convex}>
      <App />
    </ConvexProvider>
    </WsClientProvider>


);
  
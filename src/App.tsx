import { RouterProvider } from "react-router";
import { router } from "./routes";
import { ProjectProvider } from "./context/ProjectContext";
import { ToastProvider } from "./components/HudToast";

export default function App() {
  return (
    <ToastProvider>
      <ProjectProvider>
        <RouterProvider router={router} />
      </ProjectProvider>
    </ToastProvider>
  );
}

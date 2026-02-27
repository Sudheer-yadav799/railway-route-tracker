import { useRoutes } from "react-router-dom";
import { publicRoutes } from "./routes/publicRoutes";
import { Toaster } from "react-hot-toast";

function App() {
  const element = useRoutes(publicRoutes);

  return (
    <>
      <Toaster position="top-right" />
      {element}
    </>
  );
}

export default App;
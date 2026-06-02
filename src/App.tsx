import { useRoutes } from "react-router-dom";
import { publicRoutes } from "./routes/publicRoutes";
import { Toaster } from "react-hot-toast";
import { startSessionChecker } from "./utils/sessionChecker";
import { useEffect } from "react";


function App() {
  const element = useRoutes(publicRoutes);

    useEffect(() => {
    startSessionChecker();
  }, []);


  return (
    <>
      <Toaster position="top-right" />
      {element}
      
    </>
  );
}

export default App;
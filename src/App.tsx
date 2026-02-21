import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import MapView from "./pages/MapView";
import UserAccount from "./pages/UserProfile";
import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route
        path="/map"
        element={
          <ProtectedRoute>
            <MapView />
          </ProtectedRoute>
        }
      />

      <Route
        path="/userProfile"
        element={
          <ProtectedRoute>
            <UserAccount />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
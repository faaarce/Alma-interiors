import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";  // ← INI
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import WorkPage from "./components/WorkPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>           {/* ← HARUS BUNGKUS Routes */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
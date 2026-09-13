import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import TeamsPage from "./pages/TeamsPage";
import BlogListPage from "./pages/BlogListPage";
import BlogDetailPage from "./pages/BlogDetailPage";
import BlogCreatePage from "./pages/BlogCreatePage";
import WorkPage from "./components/WorkPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { SecretPage, KeyboardEgg } from "./EasterEgg";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/work" element={<WorkPage />} />
          <Route path="/kiby" element={<SecretPage />} />
          <Route path="/teams" element={<TeamsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/create" element={<ProtectedRoute><BlogCreatePage /></ProtectedRoute>} />
          <Route path="/blog/:id" element={<BlogDetailPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

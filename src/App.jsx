import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Bugs from "./pages/Bugs";
import BugDetails from "./pages/BugDetails";
import ReportBug from "./pages/ReportBug";
import Kanban from "./pages/Kanban";
import { Login, ManagerRoute, ProtectedRoute, Signup } from "./pages/AuthPages";
import Team from "./pages/Team";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/bugs" element={<ProtectedRoute><Bugs /></ProtectedRoute>} />
        <Route path="/bugs/:id" element={<ProtectedRoute><BugDetails /></ProtectedRoute>} />
        <Route path="/report" element={<ProtectedRoute><ReportBug /></ProtectedRoute>} />
        <Route path="/kanban" element={<ProtectedRoute><Kanban /></ProtectedRoute>} />
        <Route path="/team" element={<ProtectedRoute><ManagerRoute><Team /></ManagerRoute></ProtectedRoute>} />
        <Route path="*" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

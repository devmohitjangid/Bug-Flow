import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Bugs from "./pages/Bugs";
import BugDetails from "./pages/BugDetails";
import ReportBug from "./pages/ReportBug";
import Kanban from "./pages/Kanban";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />

        <Route path="/bugs" element={<Bugs />} />
        <Route path="/bugs/:id" element={<BugDetails />} />

        <Route path="/report" element={<ReportBug />} />
        <Route path="/kanban" element={<Kanban />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
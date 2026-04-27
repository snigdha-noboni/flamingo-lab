import { Navigate, Route, Routes } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Home from "./pages/Home";
import Ideas from "./pages/Ideas";
import Meetings from "./pages/Meetings";
import Notes from "./pages/Notes";
import QA from "./pages/QA";

function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/meetings" element={<Meetings />} />
          <Route path="/qa" element={<QA />} />
          <Route path="/ideas" element={<Ideas />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;

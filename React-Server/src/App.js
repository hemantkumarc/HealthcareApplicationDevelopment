import "./App.css";
import CounsellorDashboard from "./pages/counsellorDashboard/CounsellorDashboard";
import Login from "./pages/login/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/counsellorDashboard" element={<CounsellorDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

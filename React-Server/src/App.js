import "./App.css";
import CounsellorDashboard from "./components/CounsellorDashboard";
import Login from "./components/Login";
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

import "./App.css";
import CounsellorDashboard from "./components/CounsellorDashboard";
import Login from "./components/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import PatientLogin from "./components/Patients/Login";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/patientlogin" element={<PatientLogin/>} />
        <Route path="/counsellorDashboard" element={<CounsellorDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

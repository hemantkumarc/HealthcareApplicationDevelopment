import "devextreme/dist/css/dx.light.css";
import "./App.css";
import Login from "./pages/login/Login";
import PatientLogin from "./pages/Patients/Login";
import PatientDialer from "./pages/patientDialer/PatientDialer";
import CounsellorDashboard from "./pages/counsellorDashboard/CounsellorDashboard";
import SrDrDashboard from "./pages/srDocDashboard/component/SrDrDashboard";
import InCall from "./pages/inCall/InCall";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/patientlogin" element={<PatientLogin />} />
        <Route path="/patientdialer" element={<PatientDialer />} />
        <Route path="/counsellorDashboard" element={<CounsellorDashboard />} />
        <Route path="/SrDrDashboard" element={<SrDrDashboard />} />
        <Route path="/inCall" element={<InCall />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

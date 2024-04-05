import "devextreme/dist/css/dx.light.css";
import "./App.css";
import Login from "./pages/login/Login";
import PatientLogin from "./pages/patients/Login";
import PatientDialer from "./pages/patientDialer/PatientDialer";
import CounsellorDashboard from "./pages/counsellorDashboard/CounsellorDashboard";
import InCall from "./pages/inCall/InCall";
import AdminDashboard from "./pages/admin/dashboard/AdminDashboard";
import AdminCreateCounsellor from "./pages/admin/create-counsellor-seniordr/AdminCreateCounsellor";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/patientlogin" element={<PatientLogin />} />
        <Route path="/patientdialer" element={<PatientDialer />} />
        <Route path="/counsellorDashboard" element={<CounsellorDashboard />} />
        <Route path="/inCall" element={<InCall />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route
          path="/adminCreateCounsellor"
          element={<AdminCreateCounsellor />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

import "./App.css";
import CounsellorDashboard from "./pages/counsellorDashboard/CounsellorDashboard";
import Login from "./pages/login/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SrDrDashboard from "./pages/srDocDashboard/component/SrDrDashboard";
import PatientLogin from "./pages/Patients/Login";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/patientlogin" element={<PatientLogin />} />
                <Route
                    path="/counsellorDashboard"
                    element={<CounsellorDashboard />}
                />
                <Route
                    path="/SrDrDashboard"
                    element={<SrDrDashboard />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

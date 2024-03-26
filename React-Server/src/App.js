import 'devextreme/dist/css/dx.light.css';
import "./App.css";
import CounsellorDashboard from "./pages/counsellorDashboard/CounsellorDashboard";
import InCall from "./pages/inCall/InCall";
import Login from "./pages/login/Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/counsellorDashboard" element={<CounsellorDashboard />} />
        <Route path="/inCall" element={<InCall />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

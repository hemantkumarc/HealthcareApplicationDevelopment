import React, { useEffect, useState } from "react";
import "./AdminDashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import DoctorNavBar from "./DoctorNavBar";
import SideBar from "./SideBar";
import Doctor from "./Doctor";
import { userLoggedIn } from "../../../utils/utils";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ specialization: [], language: [] });
  const [sorts, setSorts] = useState({
    arrangeBy: "ascending",
    sortBy: "name",
  });
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(() => {
    const checkLoggedIn = async () => {
      const loggedIn = await userLoggedIn();
      if (loggedIn) {
        const jwtdecoded = jwtDecode(token);
        console.log("this is the jwtDecode after decoding", jwtdecoded);
        if (jwtdecoded.role !== "ROLE_ADMIN") {
          navigate("/");
        }
        localStorage.setItem("role", jwtdecoded.role);
        localStorage.setItem("id", jwtdecoded.sub);
      } else {
        navigate("/");
      }
    };
    checkLoggedIn();
  }, [navigate, token]);

  return (
    <div>
      <header className="srdocnavbar-header">
        <DoctorNavBar search={search} setSearch={setSearch} />
      </header>
      <main>
        <div className="outterbox">
          <div className="row">
            <div className="col-2">
              <div className="sidebar">
                <SideBar setFilters={setFilters} setSorts={setSorts} />
              </div>
            </div>
            <div className="col-10">
              <div className="counsellor-list">
                <Doctor filters={filters} search={search} sorts={sorts} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

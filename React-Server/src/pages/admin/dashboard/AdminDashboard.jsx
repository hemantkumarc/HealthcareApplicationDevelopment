import React, { useState } from "react";
import "./AdminDashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import DoctorNavBar from "./DoctorNavBar";
import SideBar from "./SideBar";
import Doctor from "./Doctor";

export default function AdminDashboard() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ specialization: [], language: [] });
  const [sorts, setSorts] = useState({
    arrangeBy: "ascending",
    sortBy: "name",
  });

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

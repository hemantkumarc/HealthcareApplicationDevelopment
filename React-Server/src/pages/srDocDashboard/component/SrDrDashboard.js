import React, { useState }  from "react";
import "../style/SrDrDashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import SrDocNavBar from "./SrDocNavBar";
import SideBar from "./SideBar";
import Counsellor from "./Counsellor";

export default function SrDrDashboard() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ specialization: [], language: [] });
  return (
    <div>
      <header className="srdocnavbar-header">
        <SrDocNavBar search={search} setSearch={setSearch}/>
      </header>
      <main>
        <div className="outterbox">
          <div className="row">
            <div className="col-2">
              <div className="sidebar">
                <SideBar setFilters={setFilters} />
              </div>
            </div>
            <div className="col-10">
              <div className="counsellor-list">
                <Counsellor filters={filters} search={search} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
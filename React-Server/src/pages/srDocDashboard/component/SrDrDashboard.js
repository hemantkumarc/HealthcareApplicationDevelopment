import React from "react";
import "../style/SrDrDashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import SrDocNavBar from "./SrDocNavBar";
import SideBar from "./SideBar";
import Counsellor from "./Counsellor";

export default function SrDrDashboard() {
  return (
    <div>
      <header className="srdocnavbar-header">
        <SrDocNavBar />
      </header>
      <main>
        <div className="outterbox">
          <div className="row">
            <div className="col-2">
              <div className="sidebar">
                <SideBar />
              </div>
            </div>
            <div className="col-10">
              <div className="counsellor-list">
                <Counsellor />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
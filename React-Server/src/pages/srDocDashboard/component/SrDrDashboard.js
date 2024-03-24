import React, { useState } from "react";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../style/SrDrDashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import SrDocNavBar from "./SrDocNavBar";
import FilterSection from "./FilterSection";
import SearchCounsellor from "./SearchCounsellor";
import { SearchResult } from "./SearchResult";
import SortCounsellor from "./SortCounsellor";
import Counsellor from "./Counsellor";
import drVolteLogo from "../../../assets/drVolteLogo.png";
// import api from "../api/axios";

export default function SrDrDashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState([]);
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div>
      <header>
        <SrDocNavBar />
      </header>
      <main>
        <div className="container grid grid-filter-column row">
          <div className="col-3">
            <div className="sidebar">
              <FilterSection />
              <SortCounsellor />
            </div>
          </div>
          <div className="col-9">
            <div className="wrapperSearchCounsellor">
              <div className="searchCounsellor">
                <SearchCounsellor setSearch={setSearch} />
                <SearchResult search={search} />
              </div>
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

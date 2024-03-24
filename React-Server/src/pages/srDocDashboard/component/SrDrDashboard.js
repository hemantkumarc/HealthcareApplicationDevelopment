import React, { useState } from "react";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../style/SrDrDashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import SrDocNavBar from "./SrDocNavBar";
import FilterSection from "./FilterSection";
import SearchCounsellor from "./SearchCounsellor";
import {SearchResult} from "./SearchResult";
import SortCounsellor from "./SortCounsellor";
import Counsellor from "./Counsellor";
import drVolteLogo from "../../../assets/drVolteLogo.png";
// import api from "../api/axios";

export default function SrDrDashboard() {
  const navigate = useNavigate();
  const [search, setSearch]=useState([]);
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
        <div className="container grid grid-filter-column">
          <div>
            <FilterSection />
            <SortCounsellor />
          </div>
          <section className="counsellor-view--sort">
            <div className="searchCounsellor">
                <SearchCounsellor setSearch={setSearch}/>
                <SearchResult search={search} />
            </div>
            <div className="counsellor-list">
              <Counsellor />
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
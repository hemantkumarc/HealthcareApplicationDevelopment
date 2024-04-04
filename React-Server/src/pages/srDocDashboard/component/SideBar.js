import React from "react";
import FilterSection from "./FilterSection";
import SortCounsellor from "./SortCounsellor";
import "../style/SideBar.css";
export default function SideBar({ setFilters, setSorts }) {
  return (
    <div>
      <section className="sidebar">
        <FilterSection setFilters={setFilters} />
        <SortCounsellor setSorts={setSorts} />
        {/* <div className="buttons">
            <button className="Apply-Changes">Save</button>
        </div> */}
      </section>
    </div>
  );
}

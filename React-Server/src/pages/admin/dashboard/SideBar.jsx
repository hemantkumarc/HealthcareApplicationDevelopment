import React from "react";
import FilterSection from "./FilterSection";
import SortDoctor from "./SortDoctor";
import "./SideBar.css";
export default function SideBar({ setFilters, setSorts }) {
  return (
    <div>
      <section className="sidebar">
        <FilterSection setFilters={setFilters} />
        <SortDoctor setSorts={setSorts} />
      </section>
    </div>
  );
}

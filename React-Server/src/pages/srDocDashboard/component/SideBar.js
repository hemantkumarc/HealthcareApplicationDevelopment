import React from 'react';
import FilterSection from "./FilterSection";
import SortCounsellor from "./SortCounsellor"; 
import "../style/SideBar.css";

export default function SideBar() {
  const handleChange = (event) => {
    
  };

  return (
    <div>
      <section className="sidebar">
        <FilterSection handleChange={handleChange} />
        <SortCounsellor handleChange={handleChange} />
      </section>
    </div>
  );
}
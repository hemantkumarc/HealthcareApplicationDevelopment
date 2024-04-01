import React, { useState } from 'react';
import FilterSection from "./FilterSection";
import SortCounsellor from "./SortCounsellor"; 
import "../style/SideBar.css";
export default function SideBar( {setFilters} ) {
  return (
    <div>
      <section className="sidebar">
        <FilterSection setFilters={setFilters} /> 
        <SortCounsellor setFilters={setFilters} />
        {/* <div className="buttons">
            <button className="Apply-Changes">Save</button>
        </div> */}
      </section>
    </div>
  );
}
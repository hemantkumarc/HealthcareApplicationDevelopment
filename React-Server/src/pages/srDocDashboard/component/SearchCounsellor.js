import React, { useState } from "react";
import { FaSearchPlus } from "react-icons/fa";
import "../style/SearchCounsellor.css";
// import data from "../db/data"
// import { json } from "react-router-dom";

export default function SearchCounsellor({ setSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value); 
    setSearchTerm(value);
  };
  
  return (
    <div className="search-counsellor">
      <input
        type="text"
        className="search-input"
        placeholder="search here ..."
        value={searchTerm}
        onChange={handleChange}
      />
      <FaSearchPlus className="search-icon" />
    </div>
  );
}

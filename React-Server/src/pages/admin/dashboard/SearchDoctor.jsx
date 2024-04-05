import React, { useState } from "react";
import { FaSearchPlus } from "react-icons/fa";
import "./SearchDoctor.css";

export default function SearchDoctor({ setSearch }) {
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

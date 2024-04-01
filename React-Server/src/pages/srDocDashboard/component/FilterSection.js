import React, { useState, useEffect } from "react";
import "../style/FilterSection.css";

export default function FilterSection({ setFilters }) {
  const [selectedFilters, setSelectedFilters] = useState({
    specialization: [],
    language: [],
  });

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    setSelectedFilters((prevState) => ({
      ...prevState,
      [name]: checked
        ? [...prevState[name], value]
        : prevState[name].filter((item) => item !== value),
    }));
  };

  // useState(() => {
  //   setFilters(selectedFilters);
  // }, [selectedFilters, setFilters]);

  useEffect(() => {
    setFilters(selectedFilters);
  }, [selectedFilters, setFilters]);

  return (
    <div className="srdoc-sidebar">
      <div className="filter-section">
        <h2 className="sidebar-title">Specialization</h2>

        <label className="checkbox-container">
          <input
            onChange={handleChange}
            type="checkbox"
            value="Radiologist"
            name="specialization"
          />
          <span className="checkmark"></span>Radiologist
        </label>

        <label className="checkbox-container">
          <input
            onChange={handleChange}
            type="checkbox"
            value="Orthopaedics"
            name="specialization"
          />
          <span className="checkmark"></span>Orthopaedics
        </label>

        <label className="checkbox-container">
          <input
            onChange={handleChange}
            type="checkbox"
            value="General Medicine"
            name="specialization"
          />
          <span className="checkmark"></span>General Medicine
        </label>

        <label className="checkbox-container">
          <input
            onChange={handleChange}
            type="checkbox"
            value="General Surgery"
            name="specialization"
          />
          <span className="checkmark"></span>General Surgery
        </label>
      </div>

      <div className="filter-section">
        <h2 className="sidebar-title">Language</h2>

        <label className="checkbox-container">
          <input
            onChange={handleChange}
            type="checkbox"
            value="English"
            name="language"
          />
          <span className="checkmark"></span>English
        </label>

        <label className="checkbox-container">
          <input
            onChange={handleChange}
            type="checkbox"
            value="Hindi"
            name="language"
          />
          <span className="checkmark"></span>Hindi
        </label>

        <label className="checkbox-container">
          <input
            onChange={handleChange}
            type="checkbox"
            value="Kannada"
            name="language"
          />
          <span className="checkmark"></span>Kannada
        </label>

        <label className="checkbox-container">
          <input
            onChange={handleChange}
            type="checkbox"
            value="Gujarati"
            name="language"
          />
          <span className="checkmark"></span>Gujarati
        </label>
        
        <label className="checkbox-container">
          <input
            onChange={handleChange}
            type="checkbox"
            value="Tamil"
            name="language"
          />
          <span className="checkmark"></span>Tamil
        </label>
      </div>
    </div>
  );
}

import React from "react";
import "../style/FilterSection.css";

export default function FilterSection({ handleChange }) {
  return (
    <div className="srdoc-sidebar">
      <div className="filter-section">
        <h2 className="sidebar-title">Specialization</h2>
        <label className="checkbox-container">
          <input onChange={handleChange} type="checkbox" value="" name="specialization" />
          <span className="checkmark"></span>All
        </label>

        <label className="checkbox-container">
          <input onChange={handleChange} type="checkbox" value="Radiologist" name="specialization" />
          <span className="checkmark"></span>Radiologist
        </label>

        <label className="checkbox-container">
          <input onChange={handleChange} type="checkbox" value="Orthopaedics" name="specialization" />
          <span className="checkmark"></span>Orthopaedics
        </label>

        <label className="checkbox-container">
          <input onChange={handleChange} type="checkbox" value="General Medicine" name="specialization" />
          <span className="checkmark"></span>General Medicine
        </label>

        <label className="checkbox-container">
          <input onChange={handleChange} type="checkbox" value="General Surgery" name="specialization" />
          <span className="checkmark"></span>General Surgery
        </label>
      </div>

      <div className="filter-section">
        <h2 className="sidebar-title">Language</h2>
        <label className="checkbox-container">
          <input onChange={handleChange} type="checkbox" value="" name="language" />
          <span className="checkmark"></span>All
        </label>
        
        <label className="checkbox-container">
          <input onChange={handleChange} type="checkbox" value="English" name="language" />
          <span className="checkmark"></span>English
        </label>

        <label className="checkbox-container">
          <input onChange={handleChange} type="checkbox" value="Hindi" name="language" />
          <span className="checkmark"></span>Hindi
        </label>

        <label className="checkbox-container">
          <input onChange={handleChange} type="checkbox" value="Kannada" name="language" />
          <span className="checkmark"></span>Kannada
        </label>

        <label className="checkbox-container">
          <input onChange={handleChange} type="checkbox" value="Marathi" name="language" />
          <span className="checkmark"></span>Marathi
        </label>

        <label className="checkbox-container">
          <input onChange={handleChange} type="checkbox" value="Gujrati" name="language" />
          <span className="checkmark"></span>Gujrati
        </label>
      </div>
    </div>
  );
}

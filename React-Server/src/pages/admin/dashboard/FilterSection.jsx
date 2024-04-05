import React, { useState, useEffect } from "react";
import "./FilterSection.css";
import Select from "react-select";
import { counsellorLanguages } from "../create-counsellor-seniordr/languages";

export default function FilterSection({ setFilters }) {
  const [selectedFilters, setSelectedFilters] = useState({
    specialization: [],
    language: [],
    status: [],
  });

  const [selectedLanguages, setSelectedLanguages] = useState([]);

  const handleChange = (event) => {
    const { name, value, checked } = event.target;
    setSelectedFilters((prevState) => ({
      ...prevState,
      [name]: checked
        ? [...prevState[name], value]
        : prevState[name].filter((item) => item !== value),
    }));
  };

  console.log(selectedFilters);

  // Handler for updating selected languages
  const handleLanguageChange = (selectedOptions) => {
    setSelectedLanguages(selectedOptions);
  };

  useEffect(() => {
    // Convert selected language options to an array of language labels
    const languageLabels = selectedLanguages.map((option) => option.label);
    setSelectedFilters((prevState) => ({
      ...prevState,
      language: languageLabels,
    }));
  }, [selectedLanguages]);

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
        <Select
          isMulti
          name="languages"
          options={counsellorLanguages}
          className="basic-multi-select"
          value={selectedLanguages}
          onChange={handleLanguageChange}
          classNamePrefix="select"
        />
      </div>

      <div className="filter-section">
        <h2 className="sidebar-title">Status</h2>

        <label className="checkbox-container">
          <input
            onChange={handleChange}
            type="checkbox"
            value="enabled"
            name="status"
          />
          <span className="checkmark"></span>Active
        </label>

        <label className="checkbox-container">
          <input
            onChange={handleChange}
            type="checkbox"
            value="disabled"
            name="status"
          />
          <span className="checkmark"></span>Inactive
        </label>
      </div>
    </div>
  );
}

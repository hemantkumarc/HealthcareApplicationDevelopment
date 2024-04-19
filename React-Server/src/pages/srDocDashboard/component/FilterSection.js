import React, { useState, useEffect } from "react";
import "../style/FilterSection.css";
import Select from "react-select";
import { counsellorLanguages } from "./languages";
import { specializations } from "./specializations";

export default function FilterSection({ setFilters }) {
  const [selectedFilters, setSelectedFilters] = useState({
    specialization: [],
    language: [],
    status: [],
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

  const handleMultiSelectChange = (name, selectedOptions) => {
    setSelectedFilters((prevState) => ({
      ...prevState,
      [name]: selectedOptions.map((option) => option.label),
    }));
  };

  useEffect(() => {
    setFilters(selectedFilters);
  }, [selectedFilters, setFilters]);

  return (
    <div className="srdoc-sidebar">
      <div className="filter-section">
        <h2 className="sidebar-title">Specializations</h2>
        <Select
          isMulti
          name="specializations"
          options={specializations}
          className="basic-multi-select"
          value={specializations.filter((option) =>
            selectedFilters.specialization.includes(option.label)
          )}
          onChange={(selectedOptions) =>
            handleMultiSelectChange("specialization", selectedOptions)
          }
          classNamePrefix="select"
          maxMenuHeight={150}
        />
      </div>
      <div className="filter-section">
        <h2 className="sidebar-title">Languages</h2>
        <Select
          isMulti
          name="languages"
          options={counsellorLanguages}
          className="basic-multi-select"
          value={counsellorLanguages.filter((option) =>
            selectedFilters.language.includes(option.label)
          )}
          onChange={(selectedOptions) =>
            handleMultiSelectChange("language", selectedOptions)
          }
          classNamePrefix="select"
          maxMenuHeight={150}
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
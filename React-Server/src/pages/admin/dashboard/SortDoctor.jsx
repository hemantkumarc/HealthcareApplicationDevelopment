import React, { useState, useEffect } from "react";
import "./SortDoctor.css";

export default function SortDoctor({ setSorts }) {
  const [arrangeBy, setArrangeBy] = useState("ascending");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    setSorts({ arrangeBy, sortBy });
  }, [sortBy, arrangeBy, setSorts]);

  const handleArrangeChange = (event) => {
    setArrangeBy(event.target.value);
  };

  const handleSortByChange = (event) => {
    setSortBy(event.target.value);
  };
  return (
    <div className="sort-section">
      <label className="sort-label">
        Arrange by:
        <select
          className="sort-select"
          value={arrangeBy}
          onChange={handleArrangeChange}
        >
          <option value="ascending">Ascending</option>
          <option value="descending">Descending</option>
        </select>
      </label>
      <br />
      <label className="sort-label">
        Sort by:
        <select
          className="sort-select"
          value={sortBy}
          onChange={handleSortByChange}
        >
          <option value="name">Name</option>
          <option value="specialization">Specialization</option>
        </select>
      </label>
    </div>
  );
}

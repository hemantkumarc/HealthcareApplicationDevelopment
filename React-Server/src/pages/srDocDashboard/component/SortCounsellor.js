import React, { useState } from 'react';
import '../style/SortCounsellor.css';

export default function SortCounsellor({ handleSort }) {
  const [arrangeBy, setArrangeBy] = useState('ascending');
  const [sortBy, setSortBy] = useState('name');

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
        <select className="sort-select" value={arrangeBy} onChange={handleArrangeChange}>
          <option value="ascending">Ascending</option>
          <option value="descending">Descending</option>
        </select>
      </label>
      <br />
      <label className="sort-label">
        Sort by:
        <select className="sort-select" value={sortBy} onChange={handleSortByChange}>
          <option value="name">Name</option>
          <option value="specialization">Specialization</option>
          <option value="language">Language</option>
        </select>
      </label>
    </div>
  );
}

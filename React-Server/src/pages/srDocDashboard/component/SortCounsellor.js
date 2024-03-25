import React, { useState } from 'react';

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
    <div>
      <label>
        Arrange by:
        <select value={arrangeBy} onChange={handleArrangeChange}>
          <option value="ascending">Ascending</option>
          <option value="descending">Descending</option>
        </select>
      </label>
      <br />
      <label>
        Sort by:
        <select value={sortBy} onChange={handleSortByChange}>
          <option value="name">Name</option>
          <option value="specialization">Specialization</option>
          <option value="language">Language</option>
        </select>
      </label>
    </div>
  );
}

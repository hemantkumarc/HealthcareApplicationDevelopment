import React from "react";
import "../style/SearchResult.css";
export const SearchResult = ({ search }) => {
  const handleClick = () => {
    
  };
  return (  
    <div className="results-list">
      {search.map((result, id) => {
        return (
          <div
            key={id}
            className="result-item"
            onClick={() => handleClick(result)}
          >
            {result.name}
          </div>
        );
      })}
    </div>
  );
};

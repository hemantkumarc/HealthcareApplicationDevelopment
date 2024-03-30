import React, { useState } from "react";
import { FaSearchPlus } from "react-icons/fa";
import "../style/SearchCounsellor.css";
import data from "../db/data"
// import { json } from "react-router-dom";

export default function SearchCounsellor({ setSearch }) {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    fetchData(value);
  };

  // const fetchData = (value) => {
  //   fetch(`https://jsonplaceholder.typicode.com/users?q=${value}`)
  //     .then((response) => response.json())
  //     .then((data) => {
  //       const filteredData = data.filter(
  //         (user) =>
  //           value &&
  //           user &&
  //           user.name &&
  //           user.name.toLowerCase().includes(value.toLowerCase())
  //       );
  //       setSearch(filteredData);
  //     })
  //     .catch((error) => console.error("Error fetching data:", error));
  // };

  const fetchData = (value) => {
    const filteredData = data.filter(
      (counsellor) =>
        value &&
        counsellor &&
        counsellor.name &&
        counsellor.name.toLowerCase().includes(value.toLowerCase())
    );
    setSearch(filteredData);
  };
  
  React.useEffect(() => {
    setSearch(data);
  }, []);
  
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

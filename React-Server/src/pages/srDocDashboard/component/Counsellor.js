import React from "react";
import "../style/Counsellor.css";
import Cards from "./Cards";
import data from "../db/data";

export default function Counsellor({ search }) {
  const filteredCounsellors = search.length > 0 ? search : data;
  return (
    <div className="counsellor-container">
      <section className="card-container">
        {filteredCounsellors.map((counselor) => (
          <div key={counselor.name} className="card">
            <Cards counsellor={counselor} />
          </div>
        ))}
      </section>
    </div>
  );
}

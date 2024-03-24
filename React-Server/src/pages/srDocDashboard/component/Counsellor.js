import React from "react";
import "../style/Counsellor.css";
import Cards from "./Cards";
import data from "../db/data";

export default function Counsellor() {
  return (
    <div className="counsellor-container">
      <section className="card-container">
        {data.map((counselor) => (
          <div key={counselor.id} className="card">
            <Cards counsellor={counselor} />
          </div>
        ))}
      </section>
    </div>
  );
}

import React from "react";
import "../style/Counsellor.css";
import Cards from "./Cards";
import data from "../db/data";
export default function Counsellor({ filters, search }) {
  // const filteredCounsellors = data.filter((counselor) =>
  //    counselor.name.toLowerCase().includes(search.toLowerCase())
  //  );
  const filteredCounsellors = data.filter((counselor) => {
    const matchesSpecialization =
      filters.specialization.length === 0 ||
      filters.specialization.includes(counselor.specialization);
    const matchesLanguage =
      filters.language.length === 0 ||
      counselor.languages_spoken.some((language) =>
        filters.language.includes(language)
      );

    const matchesSearchTerm =
      search === "" ||
      counselor.name.toLowerCase().includes(search.toLowerCase());

    return matchesSpecialization && matchesLanguage && matchesSearchTerm;
  });

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

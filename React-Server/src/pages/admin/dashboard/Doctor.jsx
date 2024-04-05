import React from "react";
import "./Doctor.css";
import Cards from "./Cards";
import api from "../../../api/axios";

function Doctor({ filters, search, sorts }) {
  const [sortedDoctors, setSortedDoctors] = React.useState([]);

  React.useEffect(() => {
    async function fetchData() {
      try {
        const doctors_response = await api.get(
          "http://localhost/springdatarest/doctors"
        );

        let all_doctors = [];

        const counsellor_res = doctors_response.data._embedded.counsellors;
        const seniordr_res = doctors_response.data._embedded.seniorDrs;
        counsellor_res.forEach((counsellor) => {
          if (
            counsellor.languages &&
            typeof counsellor.languages === "string"
          ) {
            const cleanedLanguages = counsellor.languages.replace(/\\\"/g, '"');
            counsellor.languages = JSON.parse(cleanedLanguages);
            counsellor.isSeniorDr = false;
            all_doctors.push(counsellor);
          }
        });

        seniordr_res.forEach((seniorDr) => {
          if (seniorDr.languages && typeof seniorDr.languages === "string") {
            const cleanedLanguages = seniorDr.languages.replace(/\\\"/g, '"');
            seniorDr.languages = JSON.parse(cleanedLanguages);
            seniorDr.isSeniorDr = true;
            all_doctors.push(seniorDr);
          }
        });

        setSortedDoctors(all_doctors);
      } catch (err) {
        console.log(err);
      }
    }
    fetchData();
  }, []);

  const updateDoctorStatus = (updatedDoctor) => {
    setSortedDoctors((prevDoctors) =>
      prevDoctors.map((doctor) =>
        doctor.email === updatedDoctor.email ? updatedDoctor : doctor
      )
    );
  };

  // const sorted_Counsellors = data
  //   .filter((counselor) => {
  //     const matchesSpecialization =
  //       filters.specialization.length === 0 ||
  //       filters.specialization.includes(counselor.specialization);
  // const matchesLanguage =
  //   filters.language.length === 0 ||
  //   counselor.languages_spoken.some((language) =>
  //     filters.language.includes(language)
  //   );

  // const matchesSearchTerm =
  //   search === "" ||
  //   counselor.name.toLowerCase().includes(search.toLowerCase());

  //     return matchesSpecialization && matchesLanguage && matchesSearchTerm;
  //   }
  const sorted_doctors = sortedDoctors
    .filter((counsellor) => {
      const matchesLanguage =
        filters.language.length === 0 ||
        counsellor.languages.some((language) =>
          filters.language.includes(language)
        );

      const matchesStatus =
        filters.status.length === 0 ||
        filters.status.includes(counsellor.status);

      const matchesSearchTerm =
        search === "" ||
        counsellor.name.toLowerCase().includes(search.toLowerCase());
      return matchesLanguage && matchesSearchTerm && matchesStatus;
    })
    .sort((a, b) => {
      let result = 0;

      if (sorts.arrangeBy === "ascending") {
        if (a[sorts.sortBy] > b[sorts.sortBy]) {
          result = 1;
        } else if (a[sorts.sortBy] < b[sorts.sortBy]) {
          result = -1;
        }
      } else {
        if (a[sorts.sortBy] < b[sorts.sortBy]) {
          result = 1;
        } else if (a[sorts.sortBy] > b[sorts.sortBy]) {
          result = -1;
        }
      }

      return result;
    });

  return (
    <div className="doctor-container">
      <section className="card-container">
        {sorted_doctors.map((doctor) => (
          <div key={doctor.email} className="card">
            <Cards doctor={doctor} updateDoctorStatus={updateDoctorStatus} />
          </div>
        ))}
      </section>
    </div>
  );
}

export default Doctor;

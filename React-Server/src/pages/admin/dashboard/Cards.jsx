import React from "react";
import "./Cards.css";
import api from "../../../api/axios.jsx";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useState, useEffect } from "react";

export default function Cards({ doctor }) {
  const DISABLE_DOCTOR_ENDPOINT = "http://localhost/springdatarest/doctors/";

  const [status, setStatus] = useState(doctor.status);

  function handleView() {
    console.log("View Button clicked !");
  }

  async function handleDisable(doctor) {
    console.log("Disable Button clicked !", doctor.resourceId);
    const obj = {
      name: doctor.name,
      email: doctor.email,
      specialization: doctor.specialization,
      hospital_name: doctor.hospital_name,
      hospital_address: doctor.hospital_address,
      qualification: doctor.qualification,
      profile_photo: doctor.profile_photo,
      date: doctor.date,
      status: doctor.status === "enabled" ? "disabled" : "enabled",
      languages: JSON.stringify(doctor.languages),
    };

    try {
      const disable_response = await api.put(
        DISABLE_DOCTOR_ENDPOINT + `${doctor.resourceId}`,
        JSON.stringify(obj),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log(disable_response.status);
      if (disable_response.data.status === "disabled") {
        setStatus("disabled");
      } else {
        setStatus("enabled");
      }
    } catch (err) {
      console.log(err);
      console.log("Disable functionality did not work !!");
    }
  }

  return (
    <div className="containers">
      <div className="card_item">
        <div className="card_inner">
          <img src={doctor.profile_photo} alt="counsellor" />
          <div className="name">{doctor.name}</div>
          <div className="qualification">
            Qualification : {doctor.qualification}
          </div>
          <div className="hospital_name">Hospital : {doctor.hospital_name}</div>
          <div className="specialization">
            Specialization : {doctor.specialization}
          </div>
          <div className="buttons">
            <button className="view" onClick={handleView}>
              View Details
            </button>
            {(status === "enabled" || status === "disabled") && (
              <button className="disable" onClick={() => handleDisable(doctor)}>
                {status === "enabled" ? "Disable" : "Enable"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

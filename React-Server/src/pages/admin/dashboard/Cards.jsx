import React from "react";
import "./Cards.css";

export default function Cards({ doctor }) {
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
            <button className="view">View Details</button>
            <button className="disable">Disable</button>
          </div>
        </div>
      </div>
    </div>
  );
}

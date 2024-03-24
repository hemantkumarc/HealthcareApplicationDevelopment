import React from "react";
import "../style/Cards.css";

export default function Cards({ counsellor }) {
  return (
    <div className="containers">
      <div className="card_item">
        <div className="card_inner">
          <img src={counsellor.profile_photo} alt="counsellor" />
          <div className="name">{counsellor.name}</div>
          <div className="qualification">{counsellor.qualification}</div>
          <div className="hospital_name">{counsellor.hospital_name}</div>
          <div className="specialization">{counsellor.specialization}</div>
          <div className="buttons">
            <button className="listen">Listen</button>
            <button className="join">Join</button>
          </div>
        </div>
      </div>
    </div>
  );
}

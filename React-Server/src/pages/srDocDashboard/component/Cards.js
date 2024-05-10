import React from "react";
import "../style/Cards.css";
import { color } from "framer-motion";

export default function Cards({ counsellor, makeConnections }) {
    let statusStyle = {};

    switch (counsellor.status) {
        // case "In-Call":
        case "enabled":
            statusStyle.backgroundColor = "lightgreen";
            break;
        case "Busy":
            statusStyle.backgroundColor = "orange";
            break;
        case "Inactive":
            statusStyle.backgroundColor = "gray";
            break;
        default:
            break;
    }
    return (
        <div className="containers">
            <div className="card_item">
                <div className="status" style={statusStyle}></div>
                <div className="card_inner">
                    {/* <img src={counsellor.profile_photo} alt="counsellor" /> */}
                    <img
                        src="https://media.istockphoto.com/id/525882213/vector/crazy-doctor.jpg?s=612x612&w=0&k=20&c=2dapPSHBjpiuPdCTyrJBk6YD_k8Hlwp9SD-BJOOeius="
                        alt="counsellor"
                    />
                    <div className="name">{counsellor.name}</div>
                    <div className="qualification">
                        {counsellor.qualification}
                    </div>
                    <div className="hospital_name">
                        {counsellor.hospital_name}
                    </div>
                    <div className="specialization">
                        {counsellor.specialization}
                    </div>
                    <div className="buttons">
                        <button className="listen" onClick={makeConnections}>
                            Listen
                        </button>
                        <button className="join" onClick={makeConnections}>
                            Join
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

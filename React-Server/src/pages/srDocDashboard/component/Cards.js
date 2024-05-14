import React from "react";
import "../style/Cards.css";
import { color } from "framer-motion";
import ImageComponent from "../../../utils/Image.jsx";

export default function Cards({
    counsellor,
    updateCounselorStatus,
    makeConnections,
    calls,
}) {
    let statusStyle = {};

    console.log("card ke aandar", typeof calls);
    // console.log(counsellor.resourceId);
    // console.log("asdasd",calls[2]);
    // if(calls[counsellor.resourceId])
    // 	console.log("jai shree ram",counsellor.resourceId, calls[counsellor.resourceId])

    switch (counsellor.status) {
        // case "In-Call":
        case "In-Call":
            statusStyle.backgroundColor = "red";
            break;
        case "Online":
            statusStyle.backgroundColor = "lightgreen";
            break;
        case "Busy":
            statusStyle.backgroundColor = "yellow";
            break;
        case "Offline":
            statusStyle.backgroundColor = "lightgrey";
            break;
        default:
            break;
    }
    return (
        <div className="containers">
            <div className="card_item">
                <div className="card_inner">
                    <div className="status" style={statusStyle}></div>
                    <ImageComponent profile_photo={counsellor.profile_photo} />
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
                        {/* <button
							className="listen"
							onClick={(e) => {
								makeConnections(
									counsellor.resourceId.toString(),
									calls[counsellor.resourceId]
								);
							}}
						>
							Listen
						</button>
						<button className="join" onClick={makeConnections}>
							Join
						</button> */}

                        {counsellor.status === "In-Call" ? (
                            <>
                                <button
                                    className="listen"
                                    onClick={(e) => {
                                        makeConnections(
                                            counsellor.resourceId.toString(),
                                            calls[counsellor.resourceId]
                                        );
                                    }}
                                >
                                    Listen
                                </button>
                                <button
                                    className="join"
                                    onClick={makeConnections}
                                >
                                    Join
                                </button>
                            </>
                        ) : (
                            <div className="fallback_div"></div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

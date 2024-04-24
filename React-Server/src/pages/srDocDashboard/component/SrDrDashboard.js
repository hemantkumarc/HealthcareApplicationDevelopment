import React, { useEffect, useState } from "react";
import "../style/SrDrDashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import SrDocNavBar from "./SrDocNavBar";
import SideBar from "./SideBar";
import Counsellor from "./Counsellor";

import { jwtDecode } from "jwt-decode";
import { userLoggedIn } from "../../../utils/utils";
import { useNavigate } from "react-router-dom";
// import {
// 	getSocketJson,
// 	initiateWebRTC,
// 	initiateWebsocket,
// 	send,
// 	userLoggedIn,
// } from "../../utils/utils";
// import InCall from "../inCall/InCall";


// const adminRole = "ROLE_ADMIN",
// 	counsellorRole = "ROLE_COUNSELLOR",
// 	patientRole = "ROLE_PATIENT";
	// seniordrRole = "ROLE_SENIORDR";
// let conn, seniordrPeerConnection;
// const connections = { conn: {}, peerConnection: {} };
export default function SrDrDashboard() {
	const [search, setSearch] = useState("");
	const [filters, setFilters] = useState({ specialization: [], language: [] });
	const [sorts, setSorts] = useState({
		arrangeBy: "ascending",
		sortBy: "name",
	});
	const [onlineStatus, setOnlineStatus] = useState([]);
	const token = localStorage.getItem("token");
	const role = localStorage.getItem("role") || "ROLE_COUNSELLOR";
	const navigate = useNavigate();




	// const handleWebSocketMessage = (message) => {
	// 	const data = JSON.parse(message.data);
	// 	setOnlineStatus(data);
	// 	console.log(data);
	// };

	useEffect(() => {
		const checkLoggedIn = async () => {
			const loggedIn = await userLoggedIn();
			if (loggedIn) {
				const jwtdecoded = jwtDecode(token);
				console.log("this is the jwtDecode after decoding", jwtdecoded);
				if (jwtdecoded.role !== "ROLE_SENIORDR") {
					navigate("/");
				}
			} else {
				navigate("/");
			}
			// if(loggedIn)
		};
		checkLoggedIn();
		// const webSocket = new WebSocket("ws://your-websocket-url");
		// webSocket.onmessage = handleWebSocketMessage;

		// return () => {
		// 	webSocket.close();
		// };
	}, []);
	// const [sorts, setSorts] = useState({ arrangeBy, sortBy });
	return (
		<div>
			<header className="srdocnavbar-header">
				<SrDocNavBar search={search} setSearch={setSearch} />
			</header>
			<main>
				<div className="outterbox">
					<div className="row">
						<div className="col-2">
							<div className="sidebar">
								<SideBar setFilters={setFilters} setSorts={setSorts} />
							</div>
						</div>
						<div className="col-10">
							<div className="counsellor-list">
								<Counsellor filters={filters} search={search} sorts={sorts} />
							</div>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}

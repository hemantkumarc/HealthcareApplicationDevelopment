import React, { useEffect, useState } from "react";
import "../style/SrDrDashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import SrDocNavBar from "./SrDocNavBar";
import SideBar from "./SideBar";
import Counsellor from "./Counsellor";

import { jwtDecode } from "jwt-decode";
import {
    getSocketJson,
    initiateWebRTC,
    initiateWebsocket,
    userLoggedIn,
} from "../../../utils/utils";
import { useNavigate } from "react-router-dom";
// import {
// 	getSocketJson,
// 	initiateWebRTC,
// 	initiateWebsocket,
// 	send,
// 	userLoggedIn,
// } from "../../utils/utils";
// import InCall from "../inCall/InCall";

const adminRole = "ROLE_ADMIN",
    counsellorRole = "ROLE_COUNSELLOR",
    patientRole = "ROLE_PATIENT";
let conn, patientPeerConnection;
const connections = { conn: {}, peerConnection: {} };

export default function SrDrDashboard() {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role") || "ROLE_COUNSELLOR";
    const [search, setSearch] = useState("");
    const [filters, setFilters] = useState({
        specialization: [],
        language: [],
    });
    const navigate = useNavigate();

    const createWebsocketAndWebRTC = () => {
        console.log("Hi caounsellor haha");
        conn = initiateWebsocket(role, connections);
        connections.conn = conn;
        conn.onopen = () => {
            conn.onclose = (msg) => {
                console.log("socket connection closed", msg.data);
            };
            function send(message) {
                conn.send(JSON.stringify(message));
            }
            send(getSocketJson("", "settoken", token, role));
            conn.addEventListener("message", async (e) => {
                console.log("received3", e);
                let data;
                try {
                    data = JSON.parse(e.data);
                } catch (error) {
                    console.log("Error:", error);
                    return;
                }
                if (data.data === "addedToken") {
                    console.log("adding token Successfull");
                }
                if (data.data === "NewPatientConnect") {
                    // console.log("Counsellor: its time to initiate webRTC hehe");
                    // let patientPeerConnection = await initiateWebRTC(conn);
                    // patientPeerConnection.ontrack = (e) => {
                    //     console.log("setting the remote stream", e);
                    //     const audio = new Audio();
                    //     audio.autoplay = true;
                    //     setTimeout(() => {
                    //         audio.srcObject = e.streams[0];
                    //         console.log("setted audio");
                    //     }, 3000);
                    //     console.log("this the audio obj", audio);
                    // };
                    //
                    //
                    //
                    //
                    // setShowCallConnectingModal(true);
                }
            });
        };
    };

    useEffect(() => {
        const checkLoggedIn = async () => {
            const loggedIn = await userLoggedIn();
            if (loggedIn) {
                const jwtdecoded = jwtDecode(token);
                console.log("this is the jwtDecode after decoding", jwtdecoded);
                if (jwtdecoded.role !== "ROLE_SENIORDR") {
                    navigate("/");
                }
                createWebsocketAndWebRTC();
            } else {
                navigate("/");
            }
            // if(loggedIn)
        };
        checkLoggedIn();
    }, []);
    // const [sorts, setSorts] = useState({ arrangeBy, sortBy });
    const [sorts, setSorts] = useState({
        arrangeBy: "ascending",
        sortBy: "name",
    });
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
                                <SideBar
                                    setFilters={setFilters}
                                    setSorts={setSorts}
                                />
                            </div>
                        </div>
                        <div className="col-10">
                            <div className="counsellor-list">
                                <Counsellor
                                    filters={filters}
                                    search={search}
                                    sorts={sorts}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

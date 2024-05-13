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
    send,
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
const functionsInRestBody = { createWebsocketConnection: {} };
const adminRole = "ROLE_ADMIN",
    counsellorRole = "ROLE_COUNSELLOR",
    patientRole = "ROLE_PATIENT",
    srDrRole = "ROLE_SENIORDR";
let conn, patientPeerConnection, counsellorPeerConnection;
const connections = {
    conn: null,
    counsellorPeerConnection: null,
    srDrPeerConnection: null,
    patientPeerConnection: null,
};
const counsellorAudio = new Audio(),
    patientAudio = new Audio();
export default function SrDrDashboard() {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role") || "ROLE_COUNSELLOR";
    const [search, setSearch] = useState("");
    const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
    const [filters, setFilters] = useState({
        specialization: [],
        language: [],
    });
    const navigate = useNavigate();

    const createPatientPeerConnection = async () => {
        send(conn, getSocketJson("", "accept", token, role, patientRole));

        patientPeerConnection = await initiateWebRTC(
            conn,
            role,
            connections,
            patientRole
        );
        connections.patientPeerConnection = patientPeerConnection;
        patientPeerConnection.ontrack = (e) => {
            console.log("setting the remote stream", e);
            patientAudio.autoplay = true;
            setTimeout(() => {
                patientAudio.srcObject = e.streams[0];
                console.log("setted patientAudio");
            }, 3000);
            console.log("this the patientAudio obj", patientAudio);
        };
    };
    const createCounsellorPeerConnection = async () => {
        counsellorPeerConnection = await initiateWebRTC(
            conn,
            role,
            connections,
            counsellorRole
        );
        connections.counsellorPeerConnection = counsellorPeerConnection;
        counsellorPeerConnection.ontrack = (e) => {
            console.log("setting the remote stream", e);
            counsellorAudio.autoplay = true;
            setTimeout(() => {
                counsellorAudio.srcObject = e.streams[0];
                console.log("setted counsellorAudio");
            }, 3000);
            console.log("this the counsellorAudio obj", counsellorAudio);
        };
    };

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
                if (data.event === "reply") {
                    if (data.data === "addedToken") {
                        console.log("adding token Successfull");
                    }
                    if (data.data === "patientConnected") {
                        console.log(
                            "patientConnected... its time to create webRTC"
                        );
                        createPatientPeerConnection();
                    }
                    if (data.data === "Connected") {
                        console.log(
                            "counsellorConnected... its time to create webRTC"
                        );
                        createCounsellorPeerConnection();
                    }
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

    const makeConnections = async (counsellorId, patientId) => {
        console.log("connecting to patient and counsellor");
        send(
            conn,
            getSocketJson(patientId, "connectpatient", token, role, patientRole)
        );
        send(
            conn,
            getSocketJson(
                counsellorId,
                "connectcounsellor",
                token,
                role,
                counsellorRole
            )
        );
    };
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
                                    makeConnections={makeConnections}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

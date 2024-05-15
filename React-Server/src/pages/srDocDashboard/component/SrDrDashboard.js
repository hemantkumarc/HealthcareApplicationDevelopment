import React, { useEffect, useState } from "react";
import "../style/SrDrDashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import SrDocNavBar from "./SrDocNavBar";
import SideBar from "./SideBar";
import Counsellor from "./Counsellor";

import { jwtDecode } from "jwt-decode";
import {
    getSocketJson,
    handlePeerConnectionClose,
    initiateWebRTC,
    initiateWebsocket,
    send,
    userLoggedIn,
} from "../../../utils/utils";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import InCall from "../../inCall/InCall";

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

var streamAudio = false;
var setIntervalBlockAudioPatient = null;
var setIntervalBlockAudioCounsellor = null;

export default function SrDrDashboard() {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role") || "ROLE_COUNSELLOR";
    const [search, setSearch] = useState("");
    const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
    const [showListeningCall, setShowListeningCall] = useState(false);
    const [showIncomingCallModal, setShowIncomingCallModal] = useState(false);
    const [showJoinCall, setShowJoinCall] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [patID, setPatID] = useState(0);

    const [filters, setFilters] = useState({
        specialization: [],
        language: [],
    });
    const navigate = useNavigate();

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

    const getIsMuted = () => isMuted;

    const toggleMute = () => {
        setIsMuted((state) => !state);
        console.log(counsellorPeerConnection);
        if (
            counsellorPeerConnection.connectionState === "disconnected" ||
            counsellorPeerConnection.connectionState === "closed" ||
            counsellorPeerConnection.connectionState === "failed"
        ) {
            disconnectCall(counsellorPeerConnection, counsellorRole);
            return;
        }
        console.log(
            "this is the getSenders",
            counsellorPeerConnection.getSenders()
        );
        const counselloraudioTracks = counsellorPeerConnection?.getSenders();
        counselloraudioTracks?.forEach((track) => {
            console.log("track", track);
            track.track.enabled = isMuted;
            // track.enabled = !isMuted; // Toggle the track's enabled state
        });
        const patientaudioTracks = patientPeerConnection?.getSenders();
        patientaudioTracks?.forEach((track) => {
            console.log("track", track);
            track.track.enabled = isMuted;
            // track.enabled = !isMuted; // Toggle the track's enabled state
        });
    };

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
            console.log("this is the streamAudio", streamAudio);
            !streamAudio &&
                setTimeout(() => {
                    console.log("setting the setInterval to block audio");
                    setIntervalBlockAudioPatient = setInterval(() => {
                        const peerConnectionTracks =
                            patientPeerConnection.getSenders();
                        peerConnectionTracks?.forEach((track) => {
                            console.log("track", track);
                            track.track.enabled = streamAudio;
                        });

                        // track.enabled = !isMuted; // Toggle the track's enabled state
                    }, 10000);
                }, 2000);
        };
        handlePeerConnectionClose(
            conn,
            patientPeerConnection,
            disconnectCall,
            patientRole
        );

        setShowJoinCall(streamAudio);
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
            !streamAudio &&
                setTimeout(() => {
                    console.log(
                        "setting the setInterval to block audio for counsellor"
                    );
                    setIntervalBlockAudioCounsellor = setInterval(() => {
                        const peerConnectionTracks =
                            counsellorPeerConnection.getSenders();
                        peerConnectionTracks?.forEach((track) => {
                            console.log("track", track);
                            track.track.enabled = streamAudio;
                        });
                    }, 10000);
                }, 2000);
        };

        handlePeerConnectionClose(
            conn,
            counsellorPeerConnection,
            disconnectCall,
            counsellorRole
        );
    };

    const createWebsocketAndWebRTC = () => {
        console.log("Hi srDoctor haha");
        conn = initiateWebsocket(role, connections);
        connections.conn = conn;
        conn.onopen = () => {
            setIsWebSocketConnected(true);
            conn.onclose = (msg) => {
                console.log("socket connection closed", msg.data);
                setIsWebSocketConnected(false);
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
                    if (data.data === "counsellorConnected") {
                        console.log(
                            "counsellorConnected... its time to create webRTC"
                        );
                        createCounsellorPeerConnection();
                    }
                }
                if (data.event === "decline") {
                    disconnectCall();
                    send(
                        conn,
                        getSocketJson(
                            "",
                            "decline",
                            token,
                            srDrRole,
                            patientRole
                        )
                    );
                    send(
                        conn,
                        getSocketJson(
                            "",
                            "decline",
                            token,
                            srDrRole,
                            counsellorRole
                        )
                    );
                }
            });
        };
    };

    const makeConnections = async (
        counsellorId,
        patientId,
        streamAudioSelected
    ) => {
        console.log(
            "connecting to patient and counsellor",
            counsellorId,
            patientId,
            streamAudioSelected
        );
        setPatID(patientId);
        streamAudio = streamAudioSelected;
        setShowListeningCall(!streamAudio);
        patientId = String(patientId);
        counsellorId = String(counsellorId);
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

    const disconnectPeerConnection = (peerConnection) => {
        if (
            peerConnection &&
            (peerConnection.connectionState === "connected" ||
                peerConnection.connectionState === "connecting")
        ) {
            console.log("peerConnection connected, Now disconnecting");
            peerConnection.close();
        }
        if (peerConnection) {
            peerConnection.close();
            peerConnection = undefined;
        }
    };

    const disconnectCall = () => {
        disconnectPeerConnection(counsellorPeerConnection);
        counsellorPeerConnection = null;
        clearTimeout(setIntervalBlockAudioPatient);

        disconnectPeerConnection(patientPeerConnection);
        patientPeerConnection = null;
        clearTimeout(setIntervalBlockAudioCounsellor);

        setShowListeningCall(false);
        setShowIncomingCallModal(false);
        setShowJoinCall(false);
    };
    return showJoinCall ? (
        <>
            <InCall
                patID={patID}
                conn={conn}
                connections={connections}
                handleEndCall={disconnectCall}
                getIsMuted={getIsMuted}
                toggleMute={toggleMute}
                setIsMuted={setIsMuted}
            />
        </>
    ) : (
        <>
            <div>
                <Modal show={showListeningCall && !streamAudio} centered>
                    <Modal.Header>
                        <Modal.Title>Listening Call</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="align-items-center d-inline-flex">
                        <lord-icon
                            src="https://cdn.lordicon.com/aollngfh.json"
                            trigger="loop"
                            delay="2000"
                            style={{ width: "250px", height: "250px" }}
                        ></lord-icon>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button
                            className="btn btn-danger"
                            variant="primary"
                            onClick={() => {
                                send(
                                    conn,
                                    getSocketJson(
                                        "",
                                        "decline",
                                        token,
                                        counsellorRole
                                    )
                                );
                                send(
                                    conn,
                                    getSocketJson(
                                        "",
                                        "decline",
                                        token,
                                        patientRole
                                    )
                                );
                                disconnectCall();
                            }}
                        >
                            End
                        </Button>
                    </Modal.Footer>
                </Modal>
                {/* <Modal show={showIncomingCallModal} centered>
                <Modal.Header>
                    <Modal.Title>Incoming Call</Modal.Title>
                </Modal.Header>

                <Modal.Footer>
                    <Button
                        className="btn btn-success"
                        variant="secondary"
                        onClick={sendAccept}
                    >
                        Accept
                    </Button>
                    <Button
                        className="btn btn-danger"
                        variant="primary"
                        onClick={sendDeclineAndDisconnect}
                    >
                        Decline
                    </Button>
                </Modal.Footer>
            </Modal> */}
                <header className="srdocnavbar-header">
                    <SrDocNavBar
                        search={search}
                        setSearch={setSearch}
                        isWebSocketConnected={isWebSocketConnected}
                        setIsWebSocketConnected={setIsWebSocketConnected}
                        createWebsocketAndWebRTC={createWebsocketAndWebRTC}
                        connections={connections}
                    />
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
        </>
    );
}

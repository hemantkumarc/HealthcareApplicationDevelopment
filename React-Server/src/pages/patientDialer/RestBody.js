import React, { useEffect, useRef, useState } from "react";
import callingTonePath from "../../assets/Audios/phone-call-outgoing.wav";
import waitToConnect from "../../assets/Audios/please-wait-call-gets-connected.mp3";
import askConsentAudioPath from "../../assets/Audios/askConsent.mp3";
import { useNavigate } from "react-router-dom";
import "./RestBody.css";
import DialerDial from "./DialerDial";
import {
    getResponseGet,
    getSocketJson,
    handlePeerConnectionClose,
    initiateWebRTC,
    initiateWebsocket,
    send,
} from "../../utils/utils";
import { Button, Modal, ModalBody } from "react-bootstrap";

const adminRole = "ROLE_ADMIN",
    counsellorRole = "ROLE_COUNSELLOR",
    patientRole = "ROLE_PATIENT",
    srDrRole = "ROLE_SENIORDR";
let conn, counsellorPeerConnection, srDrPeerConnection;
const connections = {
    conn: null,
    counsellorPeerConnection: null,
    srDrPeerConnection: null,
    patientPeerConnection: null,
};
const counsellorAudio = new Audio(),
    srDrAudio = new Audio(),
    callingTone = new Audio(callingTonePath),
    callOnwait = new Audio(waitToConnect),
    askConsentAudio = new Audio(askConsentAudioPath);

const RestBody = ({
    isWebSocketConnected,
    setIsWebSocketConnected,
    functionsInRestBody,
}) => {
    const [dial, setDial] = useState("9999000123");
    const [isWebRTCConnected, setIsWebRTCConnected] = useState(false);
    const [showCallConnectingModal, setShowCallConnectingModal] = useState();
    const [showIncomingCallModal, setShowIncomingCallModal] = useState(false);
    const [modalBody, setModalBody] = useState();
    const [isMuted, setIsMuted] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [inCallQueue, setInCallQueue] = useState(false);
    const [inGetConsentMode, setInGetConsentMode] = useState(false);

    const drVoltePhnumber = "9999000123";
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role") || "ROLE_PATIENT";
    let onlineStatus,
        declinedCounsellors = new Set();
    const navigate = useNavigate();

    callingTone.loop = true;
    callOnwait.loop = true;
    askConsentAudio.loop = true;

    useEffect(() => {
        console.log(
            "getting new socket connection... this should be ran only once in page",
            conn
        );
        createWebsocketConnection();
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            // console.log("this is timer now: ", seconds, minutes);
            setSeconds((seconds) => {
                if (seconds === 59) {
                    setMinutes((minutes) => minutes + 1);
                    return 0;
                } else {
                    return seconds + 1;
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        console.log("iswebsocketconnected changed to", isWebRTCConnected);
    }, [isWebRTCConnected]);

    const resetTimer = () => {
        setMinutes(0);
        setSeconds(0);
    };

    const createWebsocketConnection = () => {
        console.log("Creating a new WebSocket connection...", conn);
        if (isWebRTCConnected && conn && conn.readyState <= 1) return;
        conn = initiateWebsocket(role, connections);
        connections.conn = conn;
        conn.onclose = (msg) => {
            setIsWebSocketConnected(false);
            setShowCallConnectingModal(true);
            callingTone.pause();
            callOnwait.pause();
            console.log("socket connection closed", msg.data);
            setModalBody(
                <>
                    <lord-icon
                        src="https://cdn.lordicon.com/yildykzu.json"
                        trigger="loop"
                        delay="1000"
                        style={{ width: "100px", height: "100px" }}
                    ></lord-icon>
                    Broken Connection to Server
                </>
            );
            setTimeout(() => {
                setShowCallConnectingModal(false);
            }, 3000);
        };
        conn.onopen = (e) => {
            console.log("socket connection opened", conn, e);
            send(conn, getSocketJson("", "settoken", token, role));
            conn.addEventListener("message", async (e) => {
                console.log("received", e);
                let data;
                try {
                    data = JSON.parse(e.data);
                } catch (error) {
                    console.log("Error:", error);
                    return;
                }
                if (data.event === "reply") {
                    if (data.data === "Invalid JWT token") {
                        console.log(
                            "Invalid JWT token, idont know why, logging out now"
                        );
                        localStorage.clear();
                        callingTone.pause();
                        callOnwait.pause();
                        askConsentAudio.pause();
                        navigate("/patientlogin");
                    }

                    if (data.data === "NotAvailable") {
                        console.log("No Counsellor available");
                        contactCounsellor();
                    }
                    if (data.data.startsWith("NewConnection")) {
                        if (isWebRTCConnected) {
                            sendDeclineAndDisconnect();
                        } else {
                            setShowIncomingCallModal(true);
                        }
                    }
                    if (data.data === "Connected") {
                        setShowCallConnectingModal(false);
                    }
                    if (data.data === "addedToken") {
                        setIsWebSocketConnected(true);
                    }
                }
                if (data.event === "accept") {
                    if (data.source === counsellorRole) {
                        declinedCounsellors.clear();
                        console.log(
                            "patient : its time to initiate webRTC hehe"
                        );
                        counsellorPeerConnection = await initiateWebRTC(
                            conn,
                            role,
                            connections,
                            counsellorRole
                        );
                        connections.counsellorPeerConnection =
                            counsellorPeerConnection;

                        counsellorPeerConnection.ontrack = (e) => {
                            console.log("setting the remote stream", e);
                            counsellorAudio.autoplay = true;
                            callingTone.pause();
                            callOnwait.pause();
                            setTimeout(() => {
                                counsellorAudio.srcObject = e.streams[0];
                                console.log("setted audio");
                            }, 200);
                            setIsMuted(false);
                            setIsWebRTCConnected(true);
                            resetTimer();
                            setModalBody(
                                <>
                                    <lord-icon
                                        src="https://cdn.lordicon.com/jbsedsma.json"
                                        trigger="loop"
                                        delay="2000"
                                        style={{
                                            width: "100px",
                                            height: "100px",
                                        }}
                                    ></lord-icon>
                                    Connected
                                </>
                            );
                            setTimeout(
                                () => setShowCallConnectingModal(false),
                                2000
                            );
                            // audioEle.current.sourceo
                        };

                        handlePeerConnectionClose(
                            conn,
                            counsellorPeerConnection,
                            disconnectCall,
                            counsellorRole
                        );
                        console.log(
                            "counsellorPeerConnection :",
                            counsellorPeerConnection
                        );

                        var initTime = new Date();
                    }
                    if (data.source === srDrRole) {
                        connections.conn = conn;
                        console.log(
                            "patient : its time to initiate webRTC for sineor Doctor hehe"
                        );
                        srDrPeerConnection = await initiateWebRTC(
                            conn,
                            role,
                            connections,
                            srDrRole
                        );
                        connections.srDrPeerConnection = srDrPeerConnection;

                        srDrPeerConnection.ontrack = (e) => {
                            console.log(
                                "setting the remote stream for senior Doctor",
                                e
                            );

                            srDrAudio.autoplay = true;
                            setTimeout(() => {
                                srDrAudio.srcObject = e.streams[0];
                                console.log("setted audio");
                            }, 2000);
                        };

                        handlePeerConnectionClose(
                            conn,
                            srDrPeerConnection,
                            disconnectCall,
                            srDrRole
                        );
                        console.log("srDrPeerConnection :", srDrPeerConnection);
                    }
                }
                if (data.event === "decline") {
                    console.log("Got decline the call", data);
                    if (data.source === counsellorRole) {
                        if (data.data === "decline") {
                            contactCounsellor();
                        }
                        if (
                            data.data === "disconnect" &&
                            counsellorPeerConnection
                        ) {
                            declinedCounsellors.clear();
                            disconnectCall(
                                counsellorPeerConnection,
                                counsellorRole
                            );
                        }
                    } else if (data.source === srDrRole && srDrPeerConnection) {
                        disconnectCall(srDrPeerConnection, srDrRole);
                    }
                }
                if (data.event === "redirectCounsellor") {
                    sendDeclineAndDisconnect();
                    contactCounsellor(data.data);
                }
                if (data.event === "askConsent") {
                    setConsentMode();
                }
            });
        };
    };

    functionsInRestBody.createWebsocketConnection = createWebsocketConnection;

    const addnumber = (number) => {
        setDial((prevDial) => prevDial + number);
        if (inGetConsentMode) {
            send(
                conn,
                getSocketJson(
                    number,
                    "consentresponse",
                    token,
                    patientRole,
                    counsellorRole
                )
            );
            setInGetConsentMode(false);
            askConsentAudio.pause();
        }
    };

    const decreaseNumber = () => {
        setDial((prevDial) => prevDial.slice(0, -1));
    };

    const setConsentMode = () => {
        setInGetConsentMode(true);
        callOnwait.pause();
        callingTone.pause();
        setDial("");
        askConsentAudio.play();
    };

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
        const counselloraudioTracks = counsellorPeerConnection.getSenders();
        counselloraudioTracks.forEach((track) => {
            console.log("track", track);
            track.track.enabled = isMuted;
            // track.enabled = !isMuted; // Toggle the track's enabled state
        });

        if (srDrPeerConnection) {
            console.log(
                "srDrPeerConnection is valid this shuld not be running if no srDr connected",
                srDrPeerConnection
            );
            if (
                srDrPeerConnection.connectionState === "disconnected" ||
                srDrPeerConnection.connectionState === "closed" ||
                srDrPeerConnection.connectionState === "failed"
            ) {
                disconnectCall(srDrPeerConnection, srDrRole);
                return;
            }
            const srDrAudioTracks = srDrPeerConnection.getSenders();
            srDrAudioTracks.forEach((track) => {
                console.log("track", track);
                track.track.enabled = isMuted;
                // track.enabled = !isMuted; // Toggle the track's enabled state
            });
        }
    };

    const sendAccept = () => {
        send(
            conn,
            getSocketJson("", "accept", token, patientRole, counsellorRole)
        );
        setShowIncomingCallModal(false);
    };

    const sendDeclineAndDisconnect = () => {
        send(
            conn,
            getSocketJson(
                "disconnect",
                "decline",
                token,
                patientRole,
                counsellorRole
            )
        );
        setShowIncomingCallModal(false);
    };

    const whosAvailable = () => {
        let onlineCounsellors = new Set(onlineStatus?.ROLE_COUNSELLOR_online);
        console.log(
            "this is the available counsellor: ",
            onlineCounsellors,
            "these are declined coundellors",
            declinedCounsellors
        );
        return onlineCounsellors.difference(declinedCounsellors) || null;
    };

    const contactCounsellor = async (targetid) => {
        console.log("contact counsellor", targetid, declinedCounsellors);
        if (targetid) {
            send(
                conn,
                getSocketJson(
                    String(targetid),
                    "connect",
                    token,
                    role,
                    counsellorRole
                )
            );
            return;
        }

        let response = await getResponseGet("/onlinestatus");
        console.log("response", response);
        onlineStatus = response?.data ? response.data : {};
        let id = Array.from(whosAvailable());
        console.log("id", id);

        console.log("onlineStatus", onlineStatus);
        if (id.length > 0) {
            declinedCounsellors.add(id[0]);
            console.log("added the id into the declined counsellors", id[0]);
            send(
                conn,
                getSocketJson(
                    String(id[0]),
                    "connect",
                    token,
                    role,
                    counsellorRole
                )
            );
        } else if (
            onlineStatus?.ROLE_COUNSELLOR_incall &&
            onlineStatus?.ROLE_COUNSELLOR_incall.length > 0
        ) {
            setTimeout(() => {
                callingTone.pause();
                callOnwait.play();
            }, 3000);
            setIsWebRTCConnected(true);
            resetTimer();
            setShowCallConnectingModal(false);
            send(conn, getSocketJson("", "addtoqueue", token, patientRole, ""));
            setInCallQueue(true);
        } else {
            callingTone.pause();
            callOnwait.pause();
            console.log(
                "its time to give up and buy rope and stool (not that costly, think about it). theres no counsellor avaialble "
            );
            setShowCallConnectingModal(true);
            setModalBody(
                <>
                    <lord-icon
                        src="https://cdn.lordicon.com/usownftb.json"
                        trigger="loop"
                        delay="1000"
                        style={{ width: "100px", height: "100px" }}
                    ></lord-icon>
                    No Counsellor Available\nDon't Check the console message
                </>
            );
            setTimeout(() => {
                setShowCallConnectingModal(false);
            }, 3000);
            declinedCounsellors.clear();
        }
    };

    const initiateCall = () => {
        declinedCounsellors.clear();
        setShowCallConnectingModal(true);

        if (
            !dial.includes(drVoltePhnumber) ||
            !dial.endsWith(drVoltePhnumber)
        ) {
            setModalBody(
                <>
                    <lord-icon
                        src="https://cdn.lordicon.com/usownftb.json"
                        trigger="loop"
                        delay="1000"
                        style={{ width: "100px", height: "100px" }}
                    ></lord-icon>
                    Please Provide the valid Ph Number\n "Please" note that this
                    is not a real feature phone
                </>
            );
            setTimeout(() => setShowCallConnectingModal(false), 5000);
            return;
        }
        console.log(dial, "Hi patient haha", conn);
        if (!conn || conn.readyState !== 1) {
            console.log("WebSocket Not connected");
            setModalBody(
                <>
                    <lord-icon
                        src="https://cdn.lordicon.com/yildykzu.json"
                        trigger="loop"
                        delay="1000"
                        style={{ width: "100px", height: "100px" }}
                    ></lord-icon>
                    Not Connected to the Server
                </>
            );
            setTimeout(() => setShowCallConnectingModal(false), 5000);
            return;
        }

        setShowCallConnectingModal(true);

        setModalBody(
            <>
                Connecting
                <lord-icon
                    src="https://cdn.lordicon.com/lqxfrxad.json"
                    trigger="loop"
                    state="loop-line"
                    style={{ width: "50px", height: "50px" }}
                ></lord-icon>
            </>
        );
        conn.destRole = counsellorRole;

        callingTone.play();
        callOnwait.pause();
        contactCounsellor();
    };

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

    const disconnectCall = (peerConnection, destRole) => {
        console.log(
            "inside disconnect, this is webRTC connection status",
            isWebRTCConnected
        );
        callOnwait.pause();
        callingTone.pause();
        askConsentAudio.pause();
        declinedCounsellors.clear();
        addnumber("");
        if (inCallQueue) {
            send(
                conn,
                getSocketJson("", "removequeue", token, counsellorRole, "")
            );
            send(
                conn,
                getSocketJson("", "addtomissed", token, counsellorRole, "")
            );
            setInCallQueue(false);
        }
        if (!peerConnection && !destRole) {
            console.log(
                "disconnecting counsellorPeerConnection",
                counsellorPeerConnection
            );
            disconnectPeerConnection(counsellorPeerConnection);
            counsellorPeerConnection = null;
            connections.counsellorPeerConnection = null;
            setIsWebRTCConnected(false);
            send(
                conn,
                getSocketJson(
                    "disconnect",
                    "decline",
                    token,
                    role,
                    counsellorRole
                )
            );

            console.log("disconnecting SrDrPeerConnection", srDrPeerConnection);
            disconnectPeerConnection(srDrPeerConnection);
            srDrPeerConnection = null;
            connections.srDrPeerConnection = null;
            setIsWebRTCConnected(false);
            send(conn, getSocketJson("", "decline", token, role, srDrRole));

            setShowCallConnectingModal(true);
            setModalBody(
                <>
                    <lord-icon
                        src="https://cdn.lordicon.com/usownftb.json"
                        trigger="loop"
                        delay="1000"
                        style={{ width: "100px", height: "100px" }}
                    ></lord-icon>
                    Call Disconnected
                </>
            );
            setTimeout(() => {
                setShowCallConnectingModal(false);
            }, 2000);
        } else if (destRole) {
            console.log("disconnecting this Role: ", destRole);

            if (destRole === counsellorRole) {
                console.log(
                    "disconnecting counsellorPeerConnection",
                    counsellorPeerConnection
                );
                disconnectPeerConnection(counsellorPeerConnection);
                counsellorPeerConnection = null;
                connections.counsellorPeerConnection = null;

                console.log(
                    "disconnecting srDrPeerConnection",
                    srDrPeerConnection
                );
                disconnectPeerConnection(srDrPeerConnection);
                srDrPeerConnection = null;
                connections.srDrPeerConnection = null;

                setIsWebRTCConnected(false);
                send(
                    conn,
                    getSocketJson(
                        "disconnect",
                        "decline",
                        token,
                        role,
                        counsellorRole
                    )
                );

                setShowCallConnectingModal(true);
                setModalBody(
                    <>
                        <lord-icon
                            src="https://cdn.lordicon.com/usownftb.json"
                            trigger="loop"
                            delay="1000"
                            style={{ width: "100px", height: "100px" }}
                        ></lord-icon>
                        Call Disconnected
                    </>
                );
                setTimeout(() => {
                    setShowCallConnectingModal(false);
                }, 2000);
            } else if (destRole === srDrRole) {
                console.log(
                    "disconnecting srDrPeerConnection",
                    srDrPeerConnection
                );
                disconnectPeerConnection(srDrPeerConnection);
                srDrPeerConnection = null;
                connections.srDrPeerConnection = null;
                send(conn, getSocketJson("", "decline", token, role, srDrRole));
            } else {
                console.log("destRole is shit");
            }
        }
    };

    return (
        <>
            <Modal show={showCallConnectingModal} centered>
                <Modal.Header>
                    <Modal.Title>Call Status</Modal.Title>
                </Modal.Header>
                <Modal.Body className="align-items-center d-inline-flex">
                    {modalBody}
                </Modal.Body>
            </Modal>
            <Modal show={showIncomingCallModal} centered>
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
            </Modal>
            <div className="row">
                <div className="col-3"></div>
                <div className="col-6">
                    <div className="container mt-5">
                        <div className="phone-dialer">
                            <div className="row">
                                <input
                                    type="tel"
                                    id="phoneNumber"
                                    className="form-control mb-3 col"
                                    placeholder="Enter phone number"
                                    value={dial}
                                    onChange={(e) => setDial(e.target.value)}
                                />
                                {isWebRTCConnected && (
                                    <span className="align-middle col-2">
                                        {minutes + ":" + seconds}
                                    </span>
                                )}
                            </div>

                            <div className="row">
                                <DialerDial
                                    number="1"
                                    characters={""}
                                    onclickdial={addnumber}
                                />
                                <DialerDial
                                    number="2"
                                    characters={"ABC"}
                                    onclickdial={addnumber}
                                />
                                <DialerDial
                                    number="3"
                                    characters={"DEF"}
                                    onclickdial={addnumber}
                                />
                            </div>
                            <div className="row">
                                <DialerDial
                                    number={"4"}
                                    characters={"GHI"}
                                    onclickdial={addnumber}
                                />
                                <DialerDial
                                    number={"5"}
                                    characters={"JKL"}
                                    onclickdial={addnumber}
                                />
                                <DialerDial
                                    number={"6"}
                                    characters={"MNO"}
                                    onclickdial={addnumber}
                                />
                            </div>
                            <div className="row">
                                <DialerDial
                                    number={"7"}
                                    characters={"PQRS"}
                                    onclickdial={addnumber}
                                />
                                <DialerDial
                                    number={"8"}
                                    characters={"TUV"}
                                    onclickdial={addnumber}
                                />
                                <DialerDial
                                    number={"9"}
                                    characters={"WXYZ"}
                                    onclickdial={addnumber}
                                />
                            </div>
                            <div className="row">
                                <DialerDial
                                    number={""}
                                    characters={"*"}
                                    onclickdial={addnumber}
                                />
                                <DialerDial
                                    number={"0"}
                                    characters={""}
                                    onclickdial={addnumber}
                                />
                                <DialerDial
                                    number={""}
                                    characters={"#"}
                                    onclickdial={addnumber}
                                />
                            </div>
                            <div className="row">
                                <div className="col">
                                    <button
                                        type="button"
                                        className="btn btn-success fs-4"
                                        onClick={() => initiateCall()}
                                    >
                                        Call
                                        <br />
                                        <lord-icon
                                            src="https://cdn.lordicon.com/rsvfayfn.json"
                                            trigger="hover"
                                            colors="primary:#ffffff"
                                            style={{
                                                width: "30px",
                                                height: "30px",
                                            }}
                                        ></lord-icon>
                                    </button>
                                </div>
                                <div className="col">
                                    <button
                                        type="button"
                                        className="btn btn-secondary fs-4"
                                        onClick={() => decreaseNumber()}
                                    >
                                        Clear<br></br>
                                        <i className="material-icons">
                                            backspace
                                        </i>
                                    </button>
                                </div>
                                {isWebRTCConnected && (
                                    <div className="col">
                                        <button
                                            type="button"
                                            className="btn btn-light fs-4"
                                            onClick={() => toggleMute()}
                                        >
                                            {!isMuted ? (
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/jibstvae.json"
                                                    trigger="in"
                                                    delay="200"
                                                    state="in-reveal"
                                                    style={{
                                                        width: "60px",
                                                        height: "60px",
                                                    }}
                                                ></lord-icon>
                                            ) : (
                                                <lord-icon
                                                    src="https://cdn.lordicon.com/jibstvae.json"
                                                    trigger="loop"
                                                    delay="1000"
                                                    state="hover-cross"
                                                    colors="primary:#121331,secondary:#c71f16"
                                                    style={{
                                                        width: "60px",
                                                        height: "60px",
                                                    }}
                                                ></lord-icon>
                                            )}
                                        </button>
                                    </div>
                                )}

                                <div className="col">
                                    <button
                                        type="button"
                                        className="btn btn-danger fs-4"
                                        onClick={() => disconnectCall()}
                                    >
                                        Exit
                                        <br />
                                        <i className="material-icons-outlined">
                                            call_end
                                        </i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-3"></div>
            </div>
        </>
    );
};

export default RestBody;

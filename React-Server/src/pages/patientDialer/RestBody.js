import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./RestBody.css";
import DialerDial from "./DialerDial";
import {
    getSocketJson,
    handlePeerConnectionClose,
    initiateWebRTC,
    initiateWebsocket,
    send,
} from "../../utils/utils";
import { Button, Modal, ModalBody } from "react-bootstrap";
let conn, peerconnection;
const RestBody = () => {
    const [dial, setDial] = useState("");
    const [isWebRTCConnected, setIsWebRTCConnected] = useState(false);
    const [isWebSocketConnected, setIsWebSocketConnected] = useState(false);
    const [showCallConnectingModal, setShowCallConnectingModal] = useState();
    const [modalBody, setModalBody] = useState();
    const [isMuted, setIsMuted] = useState(false);
    const drVoltePhnumber = "9999000123";
    const token = localStorage.getItem("token");
    const navigate = useNavigate();

    useEffect(() => {
        console.log(
            "getting new socket connection... this should be ran only once in page",
            conn
        );
        createWebsocketConnection();
    }, []);

    const createWebsocketConnection = () => {
        console.log("Creating a new WebSocket connection...");
        conn = initiateWebsocket();
        conn.onclose = (msg) => {
            setShowCallConnectingModal(true);
            console.log("socket connection closed", msg.data);
            setModalBody("Not connected to Server");
            setTimeout(() => {
                setShowCallConnectingModal(false);
            }, 3000);
        };
        conn.onopen = (e) => {
            console.log("socket connection opened", conn, e);
            console.log("set timeout inside");
            send(conn, getSocketJson("", "settoken", token));
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
                    if (data.data === "CounsellorConnected") {
                        console.log(
                            "patient : its time to initiate webRTC hehe"
                        );
                        peerconnection = await initiateWebRTC(conn);
                        peerconnection.ontrack = (e) => {
                            console.log("setting the remote stream", e);
                            // const audio = new Audio();
                            // audio.autoplay = true;
                            // audio.srcObject = e.streams[0];
                            setIsMuted(false);
                            setModalBody("Connected");
                            setTimeout(
                                () => setShowCallConnectingModal(false),
                                2000
                            );
                            setIsWebRTCConnected(true);
                            // audioEle.current.sourceo
                        };
                        handlePeerConnectionClose(
                            conn,
                            peerconnection,
                            disconnectCall
                        );
                        console.log("peerconnection :", peerconnection);
                    }
                    if (data.data === "NoCounsellorAvailable") {
                        console.log(
                            "its time to give up and buy rope and stool (not that costly, think about it). theres no counsellor avaialble "
                        );
                        setModalBody(
                            "No Counsellor Available\nDont Check the console message"
                        );
                        setTimeout(() => {
                            setShowCallConnectingModal(false);
                        }, 3000);
                    }
                    if (data.data === "Invalid JWT token") {
                        console.log(
                            "Invalid JWT token, idont know why, logging out now"
                        );
                        localStorage.clear();
                        navigate("/patientlogin");
                    }
                }
            });
        };
    };

    const addnumber = (number) => {
        setDial((prevDial) => prevDial + number);
    };

    const decreaseNumber = () => {
        setDial((prevDial) => prevDial.slice(0, -1));
    };

    const toggleMute = () => {
        setIsMuted((state) => !state);
        console.log(peerconnection);
        // navigator.mediaDevices
        //     .getUserMedia({ audio: true, video: false })
        //     .then(function (stream) {
        //         stream.getAudioTracks().forEach((track) => {
        //             console.log("this is the state of track ", track, !isMuted);
        //             track.enabled = !isMuted;
        //         });
        //     });
        console.log("this is the getSenders", peerconnection.getSenders());
        const audioTracks = peerconnection.getSenders();
        audioTracks.forEach((track) => {
            console.log("track", track);
            track.track.enabled = !isMuted;
            // track.enabled = !isMuted; // Toggle the track's enabled state
        });
    };

    const initiateCall = () => {
        setShowCallConnectingModal(true);
        setModalBody("Connecting");
        if (
            !dial.includes(drVoltePhnumber) ||
            !dial.endsWith(drVoltePhnumber)
        ) {
            setModalBody(
                'Please Provide the valid Ph Number\n "Please" note that this is not a fucking real feature phone '
            );
            setTimeout(() => setShowCallConnectingModal(false), 5000);
            return;
        }
        console.log(dial, "Hi patient haha", conn);
        if (!conn || conn.readyState !== 1) {
            console.log("WebSocket Not connected");
            setModalBody("Not Connected to the Server");
            setTimeout(() => setShowCallConnectingModal(false), 5000);
            return;
        }

        setShowCallConnectingModal(true);
        send(conn, getSocketJson("", "connect", token));
        // initiateWebRTC(conn);
    };

    const disconnectCall = () => {
        setIsWebRTCConnected(false);
        console.log("this is peerconnection", peerconnection);
        if (
            peerconnection &&
            (peerconnection.connectionState === "connected" ||
                peerconnection.connectionState === "connecting")
        ) {
            console.log("peerconnection connected, Now disconnecting");
            peerconnection.close();
        }
        if (peerconnection) {
            peerconnection.close();
            peerconnection = undefined;
            setShowCallConnectingModal(true);
            setModalBody("Call Disconnected");
            setTimeout(() => {
                setShowCallConnectingModal(false);
            }, 2000);
        }
    };
    console.log(dial);
    return (
        <>
            <Modal show={showCallConnectingModal} centered>
                <Modal.Header>
                    <Modal.Title>Call Status</Modal.Title>
                </Modal.Header>
                <Modal.Body>{modalBody}</Modal.Body>
            </Modal>
            <div className="row">
                <div className="col-3"></div>
                <div className="col-6">
                    <div className="container mt-5">
                        <div className="phone-dialer">
                            <input
                                type="tel"
                                id="phoneNumber"
                                className="form-control mb-3"
                                placeholder="Enter phone number"
                                value={dial}
                                onChange={(e) => setDial(e.target.value)}
                            />
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
                                        className="btn btn-success"
                                        onClick={() => initiateCall()}
                                    >
                                        Call
                                        <br />
                                        <i className="material-icons">call</i>
                                    </button>
                                </div>
                                <div className="col">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
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
                                            className="btn btn-light"
                                            onClick={() => toggleMute()}
                                        >
                                            <i className="material-icons">
                                                {isMuted ? "mic" : "mic_off"}
                                            </i>
                                        </button>
                                    </div>
                                )}

                                <div className="col">
                                    <button
                                        type="button"
                                        className="btn btn-danger"
                                        onClick={() => disconnectCall()}
                                    >
                                        Exit
                                        <br />
                                        <i className="material-icons">
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

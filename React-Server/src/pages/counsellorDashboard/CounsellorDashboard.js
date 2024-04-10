import React, { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./counsellorDashStyle.css";
import { Button, Modal } from "react-bootstrap";
import { IoIosNotifications } from "react-icons/io";
import ReactBigCalendar from "./ReactBigCalendar";
import SwipeToRevealActions from "react-swipe-to-reveal-actions";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import {
    getSocketJson,
    initiateWebRTC,
    initiateWebsocket,
    userLoggedIn,
} from "../../utils/utils";
import InCall from "../inCall/InCall";

let conn, peerconnection;
export default function CounsellorDashboard() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role") || "ROLE_COUNSELLOR";
    const [showCallConnectingModal, setShowCallConnectingModal] =
        useState(false);
    const [showInCall, setShowIncall] = useState(false);

    const redirectToInCall = async () => {
        setTimeout(() => {
            setShowIncall(true);
            setShowCallConnectingModal(false);
        }, 3000);
        peerconnection = await initiateWebRTC(conn);
        peerconnection.ontrack = (e) => {
            console.log("setting the remote stream", e);
            const audio = new Audio();
            audio.autoplay = true;
            setTimeout(() => {
                audio.srcObject = e.streams[0];
                console.log("setted audio");
            }, 3000);
            console.log("this the audio obj", audio);
        };
    };

    const createWebsocketAndWebRTC = () => {
        console.log("Hi caounsellor haha");
        conn = initiateWebsocket();
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
                    // let peerconnection = await initiateWebRTC(conn);
                    // peerconnection.ontrack = (e) => {
                    //     console.log("setting the remote stream", e);
                    //     const audio = new Audio();
                    //     audio.autoplay = true;
                    //     setTimeout(() => {
                    //         audio.srcObject = e.streams[0];
                    //         console.log("setted audio");
                    //     }, 3000);
                    //     console.log("this the audio obj", audio);
                    // };
                    setShowCallConnectingModal(true);
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
                if (jwtdecoded.role !== "ROLE_COUNSELLOR") {
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
    const handleLogout = () => {
        localStorage.clear();
        navigate("/");
    };

    const patients = [
        { name: "Pappu", reason: "Bhulaaa", date: "14th Feb", time: "5:00 pm" },
        {
            name: "Mann",
            reason: "Alcoholic",
            date: "31st Dec",
            time: "2:00 am",
        },
        {
            name: "Kejriwal",
            reason: "Cough",
            date: "10th May",
            time: "10:00 am",
        },
    ];
    return showInCall ? (
        <>
            <InCall
                conn={conn}
                peerconnection={peerconnection}
                setShowIncall={setShowIncall}
            />
        </>
    ) : (
        <>
            <Modal show={showCallConnectingModal} centered>
                <Modal.Header>
                    <Modal.Title>Incoming Call</Modal.Title>
                </Modal.Header>

                <Modal.Footer>
                    <Button
                        className="btn btn-success"
                        variant="secondary"
                        onClick={redirectToInCall}
                    >
                        Accept
                    </Button>
                    <Button className="btn btn-danger" variant="primary">
                        Decline
                    </Button>
                </Modal.Footer>
            </Modal>
            <div>
                <Navbar
                    collapseOnSelect
                    expand="lg"
                    className="bg-body-tertiary"
                >
                    <Container>
                        <div id="logo">
                            <img
                                src={require("../../assets/drVolteLogo.png")}
                                alt="logo"
                                style={{
                                    height: "70px",
                                    width: "87px",
                                    marginTop: "-25px",
                                    marginLeft: "-60px",
                                }}
                            />
                        </div>
                        <Navbar.Brand href="#home">Dr.VoLTE</Navbar.Brand>
                        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                        <Navbar.Collapse id="responsive-navbar-nav">
                            <Nav className="me-auto">
                                <Nav.Link href="#features">
                                    Call History
                                </Nav.Link>
                                {/* <NavDropdown title="Dropdown" id="collapsible-nav-dropdown">
                            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">
                            Another action
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">
                            Separated link
                            </NavDropdown.Item>
                        </NavDropdown> */}
                            </Nav>
                            <Nav>
                                <Nav.Link href="#deets">
                                    <IoIosNotifications
                                        style={{
                                            fontSize: "35px",
                                            marginTop: "3px",
                                            marginRight: "8px",
                                        }}
                                    />
                                </Nav.Link>
                                <Nav.Link eventKey={2}>
                                    <Button
                                        onClick={handleLogout}
                                        variant="dark"
                                    >
                                        Logout
                                    </Button>{" "}
                                </Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>
                <div className="row">
                    <div className="App col-6">
                        <h5>Manage Schedule</h5>
                        {/* <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        weekends={false}
                        dateClick={(e) => handleDateClick(e)}
                        events={[
                        { title: "event 1", date: "2021-05-07" },
                        { title: "event 2", date: "2021-05-17" }
                        ]}
                        eventContent={renderEventContent}
                    /> */}
                        <ReactBigCalendar />
                    </div>
                    <div className="list">
                        {patients.map(({ name, reason, date, time }) => (
                            <SwipeToRevealActions
                                actionButtons={[
                                    {
                                        content: (
                                            <div className="your-className-here">
                                                <span>EDIT</span>
                                            </div>
                                        ),
                                        onClick: () =>
                                            alert("Pressed the EDIT button"),
                                    },
                                    {
                                        content: (
                                            <div className="your-className-here">
                                                <span>DELETE</span>
                                            </div>
                                        ),
                                        onClick: () =>
                                            alert("Pressed the DELETe button"),
                                    },
                                ]}
                                actionButtonMinWidth={70}
                            >
                                {name} <span>{reason}</span> <span>{date}</span>{" "}
                                <span>{time}</span>
                            </SwipeToRevealActions>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

// const SetRemoteStream = ()=>{

// }

function renderEventContent(eventInfo) {
    return (
        <>
            <b>{eventInfo.timeText}</b>
            <i>{eventInfo.event.title}</i>
        </>
    );
}

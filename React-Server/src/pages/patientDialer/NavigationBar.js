import React, { useState } from "react";
import "./NavigationBar.css";
import { Navbar, Container, Nav, Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import CallHistory from "./CallHistory";
import logo from "../../assets/drVolteLogo.png";
import { getResponsePost } from "../../utils/utils";
import Notification from "./Notification";
const NavigationBar = ({
    isWebSocketConnected,
    setIsWebSocketConnected,
    functionsInRestBody,
}) => {
    const navigate = useNavigate();
    const [showCallHistory, setShowCallHistory] = useState(false);
    const phnumber = localStorage.getItem("phNumber");
    const [notification, setNotification] = useState(false);
    const [callLogs, setCallLogs] = useState(false);
    const handleLogout = () => {
        let token = localStorage.getItem("token");
        localStorage.clear();

        token && getResponsePost("/logoutuser", token);
        navigate("/patientlogin");
    };
    const showModal = () => {
        setShowCallHistory((flag) => !flag);
    };
    return (
        <div>
            <Modal
                show={showCallHistory}
                onHide={() => setShowCallHistory(false)}
            >
                <Modal.Header closeButton>
                    <Modal.Title>
                        CallHistory{notification ? " Notification" : "jhgf"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    {callLogs && !notification && <CallHistory />}
                    {!callLogs && notification && <Notification />}
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="secondary"
                        onClick={() => setShowCallHistory(false)}
                    >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
            <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
                <Container className="navBarContainer">
                    <div id="logo2">
                        <img
                            src={logo}
                            alt="logo"
                            style={{
                                height: "70px",
                                width: "120px",
                                marginTop: "-3px",
                                marginLeft: "-30px",
                            }}
                        />
                    </div>
                    <Navbar.Brand href="#home">Dr.VoLTE</Navbar.Brand>
                    <Navbar.Text
                        className="justify-content-end rounded-pill phnumberText align-items-center d-inline-flex"
                        onClick={() => {
                            console.log("websocket connection status: ");
                            functionsInRestBody.createWebsocketConnection();
                        }}
                    >
                        {phnumber}
                        <hr style={{ width: "10px" }} />
                        {isWebSocketConnected ? (
                            <lord-icon
                                src="https://cdn.lordicon.com/pzetejwe.json"
                                trigger="loop"
                                delay="1000"
                                style={{ width: "30px", height: "30px" }}
                            ></lord-icon>
                        ) : (
                            <lord-icon
                                src="https://cdn.lordicon.com/zjhryiyb.json"
                                trigger="loop"
                                delay="1000"
                                state="morph-heart-broken"
                                colors="primary:#e83a30,secondary:#ebe6ef,tertiary:#ffc738,quaternary:#f9c9c0,quinary:#7166ee"
                                style={{ width: "30px", height: "30px" }}
                            ></lord-icon>
                        )}
                    </Navbar.Text>

                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto"></Nav>
                        <Button
                            onClick={() => {
                                setCallLogs(true);
                                setNotification(false);
                                showModal();
                            }}
                            className="btn btn-light callHistoryModalButton align-items-center d-inline-flex rounded-pill"
                        >
                            Call Logs
                            <hr style={{ width: "10px" }} />
                            <lord-icon
                                src="https://cdn.lordicon.com/vuiggmtc.json"
                                trigger="hover"
                                style={{ width: "25px", height: "25px" }}
                            ></lord-icon>
                        </Button>
                        <Nav>
                            <Nav.Link href="#deets">
                                <lord-icon
                                    src="https://cdn.lordicon.com/lznlxwtc.json"
                                    trigger="hover"
                                    colors="primary:#848484"
                                    style={{ width: "40px", height: "40px" }}
                                    onClick={() => {
                                        setCallLogs(false);
                                        setNotification(true);
                                        showModal();
                                    }}
                                ></lord-icon>
                            </Nav.Link>

                            <Nav.Link eventKey={2}>
                                <Button onClick={handleLogout} variant="dark">
                                    Logout
                                </Button>{" "}
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </div>
    );
};
export default NavigationBar;

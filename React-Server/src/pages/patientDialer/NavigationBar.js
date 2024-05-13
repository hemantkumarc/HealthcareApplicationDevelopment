import React, { useState } from "react";
import "./NavigationBar.css";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { IoIosNotifications } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import CallHistory from "./CallHistory";
import logo from "../../assets/drVolteLogo.png";
import { getResponsePost } from "../../utils/utils";
const NavigationBar = ({
    isWebSocketConnected,
    setIsWebSocketConnected,
    functionsInRestBody,
}) => {
    const navigate = useNavigate();
    const [showCallHistory, setShowCallHistory] = useState(false);
    const [status, setStatus] = useState("green");
    const phnumber = localStorage.getItem("phNumber");

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
            <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
                <Container className="navBarContainer">
                    <div id="logo">
                        <img
                            src={logo}
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
                    <Navbar.Text
                        className="justify-content-end rounded-pill phnumberText align-items-center d-inline-flex"
                        onClick={() => {
                            !isWebSocketConnected &&
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
                            onClick={() => showModal()}
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
                        <CallHistory
                            showCallHistory={showCallHistory}
                            setShowCallHistory={setShowCallHistory}
                        />
                        <Nav>
                            <Nav.Link href="#deets">
                                <lord-icon
                                    src="https://cdn.lordicon.com/lznlxwtc.json"
                                    trigger="hover"
                                    colors="primary:#848484"
                                    style={{ width: "40px", height: "40px" }}
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

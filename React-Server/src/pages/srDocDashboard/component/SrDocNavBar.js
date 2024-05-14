import { React, useEffect, useState } from "react";
import "../style/SrDocNavBar.css";
import drVolteLogo from "../../../assets/drVolteLogo.png";
import { useNavigate } from "react-router-dom";
import SearchCounsellor from "./SearchCounsellor";
import StatusToggle from "./StatusToggle";
import SearchResult from "./SearchResult";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import { FiMoon, FiSun } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";
import {
    getResponseGet,
    getResponsePost,
    getSocketJson,
    initiateWebRTC,
    initiateWebsocket,
    send,
    userLoggedIn,
} from "../../../utils/utils";
let patientPeerConnection, srDrPeerConnection;
// const connections = {
//     conn: null,
//     counsellorPeerConnection: null,
//     srDrPeerConnection: null,
//     patientPeerConnection: null,
// };

const adminRole = "ROLE_ADMIN",
    counsellorRole = "ROLE_COUNSELLOR",
    patientRole = "ROLE_PATIENT",
    srDrRole = "ROLE_SENIORDR";

let token = localStorage.getItem("token");

const TOGGLE_CLASSES =
    "text-sm font-medium flex items-center gap-2 px-3 md:pl-3 md:pr-3.5 py-3 md:py-1.5 transition-colors relative z-10";

export default function SrDocNavBar({
    setSearch,
    isWebSocketConnected,
    setIsWebSocketConnected,
    createWebsocketAndWebRTC,
    connections,
}) {
    token = localStorage.getItem("token");
    const navigate = useNavigate();
    const name = localStorage.getItem("name");
    const handleLogout = () => {
        localStorage.clear();

        token && getResponsePost("/logoutuser", token);
        navigate("/");
    };

    const [selected, setSelected] = useState("active");
    useEffect(() => {
        token = localStorage.getItem("token");
    }, []);

    return (
        <Navbar
            collapseOnSelect
            expand="lg"
            className="bg-body-tertiary .navbar-align"
            fixed="top"
        >
            <Container>
                <Navbar.Brand href="#home">
                    <img
                        style={{ width: "130px" }}
                        src={drVolteLogo}
                        alt="logo"
                        className="img-logo"
                    />
                </Navbar.Brand>
                <Navbar.Text
                    style={{ marginLeft: "-60px", marginRight: "20px" }}
                >
                    Dr.VoLTE
                </Navbar.Text>
                <Navbar.Text
                    className="justify-content-end rounded-pill phnumberText align-items-center d-inline-flex"
                    onClick={() => {
                        !isWebSocketConnected && createWebsocketAndWebRTC();
                    }}
                >
                    {name}
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
                    <Nav className="ml-auto" style={{ alignItems: "center" }}>
                        <div
                            className={`grid h-[67px] place-content-center px-4 transition-colors ${
                                selected === "busy" ? "bg-gray" : "bg-gray"
                            }`}
                        >
                            <SliderToggle
                                selected={selected}
                                setSelected={setSelected}
                                connections={connections}
                            />
                        </div>
                        <Nav.Link>
                            <div className="search-container">
                                <SearchCounsellor setSearch={setSearch} />
                                {/* <SearchResult search={search} /> */}
                            </div>
                        </Nav.Link>
                        <Nav.Link eventKey={2}>
                            <Button
                                onClick={handleLogout}
                                variant="dark"
                                className="lg-button"
                            >
                                Logout
                            </Button>
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

const SliderToggle = ({ selected, setSelected, connections }) => {
    console.log("this connections var: ", connections);
    return (
        <div className="relative flex w-fit items-center rounded-full">
            <button
                className={`${TOGGLE_CLASSES} ${
                    selected === "busy" ? "text-white" : "text-slate-800"
                }`}
                onClick={() => {
                    setSelected("busy");
                    send(
                        connections.conn,
                        getSocketJson(
                            "connected:busy",
                            "changestate",
                            token,
                            counsellorRole
                        )
                    );
                }}
            >
                <FiMoon className="relative z-10 text-lg md:text-sm" />
                <span className="relative z-10">Busy</span>
            </button>
            <button
                className={`${TOGGLE_CLASSES} ${
                    selected === "active" ? "text-white" : "text-slate-800"
                }`}
                onClick={() => {
                    setSelected("active");
                    send(
                        connections.conn,
                        getSocketJson(
                            "busy:connected",
                            "changestate",
                            token,
                            counsellorRole
                        )
                    );
                }}
            >
                <FiSun className="relative z-10 text-lg md:text-sm" />
                <span className="relative z-10">Active</span>
            </button>
            <div
                className={`absolute inset-0 z-0 flex ${
                    selected === "active" ? "justify-end" : "justify-start"
                }`}
            >
                <motion.span
                    layout
                    transition={{ type: "spring", damping: 15, stiffness: 250 }}
                    className={`h-full w-1/2 rounded-full ${
                        selected === "busy"
                            ? "bg-gradient-to-r from-red-500 to-red-700"
                            : "bg-gradient-to-r from-violet-600 to-indigo-600"
                    }`}
                />
            </div>
        </div>
    );
};

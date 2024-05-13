import React, { useEffect, useState } from "react";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import Container from "react-bootstrap/Container";
import { Button, Card } from "react-bootstrap";
import { IoIosNotifications } from "react-icons/io";
import { PieChart } from "@mui/x-charts/PieChart";
import { Gauge, gaugeClasses } from "@mui/x-charts/Gauge";
import "./rStyle.css";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import CssBaseline from "@mui/material/CssBaseline";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import MailIcon from "@mui/icons-material/Mail";
import { ScatterChart } from "@mui/x-charts/ScatterChart";
import { Calendar, Whisper, Popover, Badge } from "rsuite";
import "rsuite/Calendar/styles/index.css";
import ListGroup from "react-bootstrap/ListGroup";
import { List } from "rsuite";
import "rsuite/List/styles/index.css";
import "./todoStyle.css";
import { TodoWrapper } from "./todo/TodoWrapper";
import { useNavigate } from "react-router-dom";
import Timeline from "@mui/lab/Timeline";
import TimelineItem from "@mui/lab/TimelineItem";
import TimelineSeparator from "@mui/lab/TimelineSeparator";
import TimelineConnector from "@mui/lab/TimelineConnector";
import TimelineContent from "@mui/lab/TimelineContent";
import TimelineDot from "@mui/lab/TimelineDot";
import {
    getResponseGet,
    getSocketJson,
    initiateWebRTC,
    initiateWebsocket,
    send,
    userLoggedIn,
} from "../../utils/utils";
import lottie from "lottie-web";
import { defineElement } from "lord-icon-element";
import InCall from "../inCall/InCall";
import { jwtDecode } from "jwt-decode";
import { Modal } from "react-bootstrap";
import { FiMoon, FiSun } from "react-icons/fi";
import { AnimatePresence, motion } from "framer-motion";
import { FiAlertCircle } from "react-icons/fi";

defineElement(lottie.loadAnimation);

const TOGGLE_CLASSES =
  "text-sm font-medium flex items-center gap-2 px-3 md:pl-3 md:pr-3.5 py-3 md:py-1.5 transition-colors relative z-10";

const drawerWidth = 240;

const data = [
    { id: 0, value: 10, label: "Chronic" },
    { id: 1, value: 15, label: "Acute" },
    { id: 2, value: 20, label: "Seasonal" },
];

const settings = {
    width: 200,
    height: 200,
    value: 60,
};

const dataS = [
    {
        id: "data-0",
        x1: 329.39,
        x2: 391.29,
        y1: 443.28,
        y2: 153.9,
    },
    {
        id: "data-1",
        x1: 96.94,
        x2: 139.6,
        y1: 110.5,
        y2: 217.8,
    },
    {
        id: "data-2",
        x1: 336.35,
        x2: 282.34,
        y1: 175.23,
        y2: 286.32,
    },
    {
        id: "data-3",
        x1: 159.44,
        x2: 384.85,
        y1: 195.97,
        y2: 325.12,
    },
    {
        id: "data-4",
        x1: 188.86,
        x2: 182.27,
        y1: 351.77,
        y2: 144.58,
    },
    {
        id: "data-5",
        x1: 143.86,
        x2: 360.22,
        y1: 43.253,
        y2: 146.51,
    },
    {
        id: "data-6",
        x1: 202.02,
        x2: 209.5,
        y1: 376.34,
        y2: 309.69,
    },
    {
        id: "data-7",
        x1: 384.41,
        x2: 258.93,
        y1: 31.514,
        y2: 236.38,
    },
    {
        id: "data-8",
        x1: 256.76,
        x2: 70.571,
        y1: 231.31,
        y2: 440.72,
    },
    {
        id: "data-9",
        x1: 143.79,
        x2: 419.02,
        y1: 108.04,
        y2: 20.29,
    },
    {
        id: "data-10",
        x1: 103.48,
        x2: 15.886,
        y1: 321.77,
        y2: 484.17,
    },
    {
        id: "data-11",
        x1: 272.39,
        x2: 189.03,
        y1: 120.18,
        y2: 54.962,
    },
    {
        id: "data-12",
        x1: 23.57,
        x2: 456.4,
        y1: 366.2,
        y2: 418.5,
    },
    {
        id: "data-13",
        x1: 219.73,
        x2: 235.96,
        y1: 451.45,
        y2: 181.32,
    },
    {
        id: "data-14",
        x1: 54.99,
        x2: 434.5,
        y1: 294.8,
        y2: 440.9,
    },
    {
        id: "data-15",
        x1: 134.13,
        x2: 383.8,
        y1: 121.83,
        y2: 273.52,
    },
    {
        id: "data-16",
        x1: 12.7,
        x2: 270.8,
        y1: 287.7,
        y2: 346.7,
    },
    {
        id: "data-17",
        x1: 176.51,
        x2: 119.17,
        y1: 134.06,
        y2: 74.528,
    },
    {
        id: "data-18",
        x1: 65.05,
        x2: 78.93,
        y1: 104.5,
        y2: 150.9,
    },
    {
        id: "data-19",
        x1: 162.25,
        x2: 63.707,
        y1: 413.07,
        y2: 26.483,
    },
    {
        id: "data-20",
        x1: 68.88,
        x2: 150.8,
        y1: 74.68,
        y2: 333.2,
    },
    {
        id: "data-21",
        x1: 95.29,
        x2: 329.1,
        y1: 360.6,
        y2: 422.0,
    },
    {
        id: "data-22",
        x1: 390.62,
        x2: 10.01,
        y1: 330.72,
        y2: 488.06,
    },
];

function getTodoList(date) {
    const day = date.getDate();

    switch (day) {
        case 10:
            return [
                { time: "10:30 am", title: "Meeting" },
                { time: "12:00 pm", title: "Lunch" },
            ];
        case 15:
            return [
                { time: "09:30 pm", title: "Products Introduction Meeting" },
                { time: "12:30 pm", title: "Client entertaining" },
                { time: "02:00 pm", title: "Product design discussion" },
                { time: "05:00 pm", title: "Product test and acceptance" },
                { time: "06:30 pm", title: "Reporting" },
                { time: "10:00 pm", title: "Going home to walk the dog" },
            ];
        default:
            return [];
    }
}

function formatDateString(dateString) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const date = new Date(dateString);
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    return `${day} ${months[monthIndex]}`;
}

function formatTime(dateString) {
    const date = new Date(dateString);
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const amPM = hours >= 12 ? 'PM' : 'AM';

    // Convert to 12-hour format
    hours = hours % 12;
    hours = hours ? hours : 12; // Handle midnight (0 hours)

    console.log(hours + ":" + (minutes < 10 ? '0' : '') + minutes + ' ' + amPM);
    return `${hours}:${(minutes < 10 ? '0' : '') + minutes} ${amPM}`
}

const adminRole = "ROLE_ADMIN",
counsellorRole = "ROLE_COUNSELLOR",
patientRole = "ROLE_PATIENT",
srDrRole = "ROLE_SENIORDR";
let conn, patientPeerConnection, srDrPeerConnection;
const connections = {
    conn: null,
    counsellorPeerConnection: null,
    srDrPeerConnection: null,
    patientPeerConnection: null,
};
const srDrAudio = new Audio(),
    patientAudio = new Audio();

const token = localStorage.getItem("token");
let patientsList
let selectedPatient

//------------------------------------------------------------------------------------------------------------------------------

function CounsellorDashboard() {
    const [callbacks, setCallbacks] = useState([]);

    useEffect(() => {
        const getPatients = async () => {
            let res = await getResponseGet('/springdatarest/patients')
            patientsList = res?.data?._embedded?.patients
            console.log("Patients: ", patientsList)
        }
        getPatients()

        const getCallbacks = async () => {
            let response = await getResponseGet('/springdatarest/callBacks')
            setCallbacks(response?.data?._embedded?.callBacks)
            console.log("Callbacks: ", callbacks)
        }
        getCallbacks()
    },[])

    const [selectedItem, setSelectedItem] = useState(null);

    const [isOpen, setIsOpen] = useState(false);

    const [selected, setSelected] = useState("busy");

    const navigate = useNavigate();
    const role = localStorage.getItem("role") || "ROLE_COUNSELLOR";
    const [showCallConnectingModal, setShowCallConnectingModal] =
        useState(false);
    const [showInCall, setShowIncall] = useState(false);
    const [isMuted, setIsMuted] = useState(false);

    const acceptIncommingCall = async () => {
        if (selected == "active") {
            setTimeout(() => {
                setShowIncall(true);
                setShowCallConnectingModal(false);
            }, 3000);
            conn.destRole = patientRole;
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
                    console.log("setted audio");
                }, 2000);
                console.log("this the audio obj", patientAudio);
            };
        }
    };

    const declineIcommingCall = () => {
        send(
            conn,
            getSocketJson("decline", "decline", token, role, patientRole)
        );
        setShowCallConnectingModal(false);
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
                    if (data.data === "NewPatientConnect") {
                        setShowCallConnectingModal(true);
                    }
                    if (data.data === "srDrConnect") {
                        console.log("senior Doctor Connecting");
                        srDrPeerConnection = await initiateWebRTC(
                            conn,
                            role,
                            connections,
                            srDrRole
                        );
                        connections.srDrPeerConnection = srDrPeerConnection;
                        srDrPeerConnection.ontrack = (e) => {
                            console.log("setting the remote stream", e);

                            srDrAudio.autoplay = true;
                            setTimeout(() => {
                                srDrAudio.srcObject = e.streams[0];
                                console.log("setted audio");
                            }, 2000);
                            console.log("this the audio obj", srDrAudio);
                        };
                    }
                }
                if (data.event === "decline") {
                    console.log("Got decline the call", data);
                    if (data.source === srDrRole && srDrPeerConnection) {
                        handleEndCall(srDrPeerConnection, srDrRole);
                    }
                    if (data.source === patientRole && patientPeerConnection) {
                        handleEndCall(patientPeerConnection, patientRole);
                    }
                }
            });
        };
    };

    const disconnectPeerConnection = (peerconnection) => {
        if (
            peerconnection &&
            (peerconnection.connectionState === "connected" ||
                peerconnection.connectionState === "connecting")
        ) {
            console.log("peerconnection connected, Now disconnecting");

            peerconnection.close();
            peerconnection = undefined;
        }
        if (peerconnection) {
            peerconnection.close();
            peerconnection = undefined;
        }
    };

    const handleEndCall = (peerConnection, destRole) => {
        if (!peerConnection && !destRole) {
            disconnectPeerConnection(connections.patientPeerConnection);
            connections.patientPeerConnection = null;
            send(
                conn,
                getSocketJson("disconnect", "decline", token, role, patientRole)
            );

            disconnectPeerConnection(connections.srDrPeerConnection);
            connections.srDrPeerConnection = null;
            send(conn, getSocketJson("", "decline", token, role, srDrRole));

            setTimeout(() => {
                setShowIncall(false);
            }, 1000);
        } else if (destRole) {
            console.log("disconnecting this Role: ", destRole);

            if (destRole === patientRole) {
                console.log(
                    "disconnecting patientPeerConnection",
                    connections.patientPeerConnection
                );
                disconnectPeerConnection(connections.patientPeerConnection);
                connections.patientPeerConnection = null;
                patientPeerConnection = null;
                send(
                    conn,
                    getSocketJson("", "decline", token, role, patientRole)
                );

                console.log(
                    "disconnecting srDrPeerConnection",
                    connections.srDrPeerConnection
                );
                disconnectPeerConnection(connections.srDrPeerConnection);
                connections.srDrPeerConnection = null;
                srDrPeerConnection = null;
                send(conn, getSocketJson("", "decline", token, role, srDrRole));

                setTimeout(() => {
                    setShowIncall(false);
                }, 1000);
            } else if (destRole === srDrRole) {
                console.log(
                    "disconnecting srDrPeerConnection",
                    connections.srDrPeerConnection
                );
                disconnectPeerConnection(connections.srDrPeerConnection);
                connections.srDrPeerConnection = null;
                srDrPeerConnection = null;
                send(conn, getSocketJson("", "decline", token, role, srDrRole));
            } else {
                console.log("destRole is shit");
            }
        }
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

    function renderCell(date) {
        const list = getTodoList(date);
        const displayList = list.filter((item, index) => index < 2);

        if (list.length) {
            const moreCount = list.length - displayList.length;
            const moreItem = (
                <li>
                    <Whisper
                        placement="top"
                        trigger="click"
                        speaker={
                            <Popover>
                                {list.map((item, index) => (
                                    <p key={index}>
                                        <b>{item.time}</b> - {item.title}
                                    </p>
                                ))}
                            </Popover>
                        }
                    >
                        <a>{moreCount} more</a>
                    </Whisper>
                </li>
            );

            return (
                <ul className="calendar-todo-list">
                    {displayList.map((item, index) => (
                        <li key={index}>
                            <Badge /> <b>{item.time}</b> - {item.title}
                        </li>
                    ))}
                    {moreCount ? moreItem : null}
                </ul>
            );
        }

        return null;
    }

    const toggleMute = () => {
        setIsMuted((state) => !state);
        console.log(patientPeerConnection);
        // navigator.mediaDevices
        //     .getUserMedia({ audio: true, video: false })
        //     .then(function (stream) {
        //         stream.getAudioTracks().forEach((track) => {
        //             console.log("this is the state of track ", track, !isMuted);
        //             track.enabled = !isMuted;
        //         });
        //     });
        console.log(
            "this is the getSenders",
            patientPeerConnection.getSenders()
        );
        if (
            patientPeerConnection.connectionState === "disconnected" ||
            patientPeerConnection.connectionState === "closed" ||
            patientPeerConnection.connectionState === "failed"
        ) {
            handleEndCall(patientPeerConnection, patientRole);
            return;
        }
        const counselloraudioTracks = patientPeerConnection.getSenders();
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
                handleEndCall(srDrPeerConnection, srDrRole);
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

    const getIsMuted = () => isMuted;
    return showInCall ? (
        <>
            <InCall
                conn={conn}
                connections={connections}
                setShowIncall={setShowIncall}
                handleEndCall={handleEndCall}
                getIsMuted={getIsMuted}
                toggleMute={toggleMute}
                setIsMuted={setIsMuted}
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
                        onClick={acceptIncommingCall}
                    >
                        Accept
                    </Button>
                    <Button
                        className="btn btn-danger"
                        variant="primary"
                        onClick={declineIcommingCall}
                    >
                        Decline
                    </Button>
                </Modal.Footer>
            </Modal>
            <div id="dashParent">
                <div id="dash">
                    <Box sx={{ display: "flex" }}>
                        <CssBaseline />
                        <AppBar
                            position="fixed"
                            sx={{
                                width: `calc(100% - ${drawerWidth}px)`,
                                ml: `${drawerWidth}px`,
                            }}
                        >
                            <Navbar
                                id="navv"
                                collapseOnSelect
                                expand="lg"
                                className="bg-body-tertiary"
                            >
                                <Container id="container">
                                    <Navbar.Brand href="#home">
                                        Dr.VoLTE
                                    </Navbar.Brand>
                                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                                    <Navbar.Collapse id="responsive-navbar-nav">
                                        <Nav className="me-auto">
                                            <Nav.Link href="#features">
                                                Call History
                                            </Nav.Link>
                                        </Nav>
                                        <Nav>

                                        <div
                                            className={`grid h-[67px] place-content-center px-4 transition-colors ${
                                                selected === "busy" ? "bg-gray" : "bg-gray"
                                            }`}
                                            >
                                            <SliderToggle selected={selected} setSelected={setSelected} />
                                        </div>

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
                                                    variant="dark"
                                                    onClick={handleLogout}
                                                >
                                                    Logout
                                                </Button>{" "}
                                            </Nav.Link>
                                        </Nav>
                                    </Navbar.Collapse>
                                </Container>
                            </Navbar>
                        </AppBar>
                        <Drawer
                            sx={{
                                width: drawerWidth,
                                flexShrink: 0,
                                "& .MuiDrawer-paper": {
                                    width: drawerWidth,
                                    boxSizing: "border-box",
                                },
                            }}
                            variant="permanent"
                            anchor="left"
                        >
                            <Toolbar>
                                <div>
                                    <img
                                        src={require("../../assets/drVolteLogo.png")}
                                        alt=""
                                        style={{height: "70px", width: "150px", marginLeft: "-30px"}}
                                    />
                                </div>
                                <div id="user">
                                    <img
                                        src={require("../../assets/curly-hair-man.png")}
                                        alt="user"
                                        style={{
                                            height: "65px",
                                            width: "75px"
                                        }}
                                    />
                                </div>
                                <div id="profile">
                                    <img
                                        id="profileInfo"
                                        src={require("../../assets/sign-up.png")}
                                        alt="profile"
                                        style={{
                                            height: "70px",
                                            width: "80px",
                                            marginBottom: "-3px",
                                        }}
                                    />
                                </div>
                            </Toolbar>
                            <Divider />
                            <List>
                                {[
                                    "Inbox",
                                    "Starred",
                                    "Send email",
                                    "Drafts",
                                ].map((text, index) => (
                                    <ListItem key={text} disablePadding>
                                        <ListItemButton>
                                            <ListItemIcon>
                                                {index % 2 === 0 ? (
                                                    <InboxIcon />
                                                ) : (
                                                    <MailIcon />
                                                )}
                                            </ListItemIcon>
                                            <ListItemText primary={text} />
                                        </ListItemButton>
                                    </ListItem>
                                ))}
                            </List>
                            <Divider />
                            <List>
                                {["All mail", "Trash", "Spam"].map(
                                    (text, index) => (
                                        <ListItem key={text} disablePadding>
                                            <ListItemButton>
                                                <ListItemIcon>
                                                    {index % 2 === 0 ? (
                                                        <InboxIcon />
                                                    ) : (
                                                        <MailIcon />
                                                    )}
                                                </ListItemIcon>
                                                <ListItemText primary={text} />
                                            </ListItemButton>
                                        </ListItem>
                                    )
                                )}
                            </List>
                            <img
                                src={require("../../assets/Singing Contract (1).gif")}
                                alt="docGif"
                            />
                        </Drawer>

                        <div className="row bgDash mContent">
                            <Card id="pieCard" className="col-3">
                                <PieChart
                                    series={[
                                        {
                                            data,
                                            highlightScope: {
                                                faded: "global",
                                                highlighted: "item",
                                            },
                                            faded: {
                                                innerRadius: 30,
                                                additionalRadius: -30,
                                                color: "gray",
                                            },
                                        },
                                    ]}
                                    height={200}
                                />
                            </Card>

                            <Card id="gauge" className="col-3">
                                <Gauge
                                    {...settings}
                                    cornerRadius="50%"
                                    sx={(theme) => ({
                                        [`& .${gaugeClasses.valueText}`]: {
                                            fontSize: 40,
                                        },
                                        [`& .${gaugeClasses.valueArc}`]: {
                                            fill: "#52b202",
                                        },
                                        [`& .${gaugeClasses.referenceArc}`]: {
                                            fill: theme.palette.text.disabled,
                                        },
                                    })}
                                />
                            </Card>

                            <Card id="doc" className="col-6">
                                <div className="row">
                                    <Card.Img
                                        className="col-3"
                                        id="imgCard"
                                        variant="top"
                                        src={require("../../assets/doctorTile.jpg")}
                                    />
                                    <Timeline
                                        id="timeline"
                                        position="alternate"
                                        className="col-4"
                                    >
                                        <TimelineItem>
                                            <TimelineSeparator>
                                                <TimelineDot variant="outlined" />
                                                <TimelineConnector />
                                            </TimelineSeparator>
                                            <TimelineContent>
                                                Greet
                                            </TimelineContent>
                                        </TimelineItem>
                                        <TimelineItem>
                                            <TimelineSeparator>
                                                <TimelineDot
                                                    variant="outlined"
                                                    color="primary"
                                                />
                                                <TimelineConnector />
                                            </TimelineSeparator>
                                            <TimelineContent>
                                                Treat
                                            </TimelineContent>
                                        </TimelineItem>
                                        <TimelineItem>
                                            <TimelineSeparator>
                                                <TimelineDot
                                                    variant="outlined"
                                                    color="secondary"
                                                />
                                            </TimelineSeparator>
                                            <TimelineContent>
                                                Sleep
                                            </TimelineContent>
                                        </TimelineItem>
                                    </Timeline>
                                </div>
                            </Card>

                            <div className="row">
                                <div className="col-4">
                                    <ScatterChart
                                        width={500}
                                        height={300}
                                        series={[
                                            {
                                                label: "Pneumonia",
                                                data: dataS.map((v) => ({
                                                    x: v.x1,
                                                    y: v.y1,
                                                    id: v.id,
                                                })),
                                            },
                                            {
                                                label: "Tuberculosis",
                                                data: dataS.map((v) => ({
                                                    x: v.x1,
                                                    y: v.y2,
                                                    id: v.id,
                                                })),
                                            },
                                        ]}
                                    />
                                </div>

                                <div id="ls" className="col-3">
                                    <List
                                        id="listAppointments"
                                        style={{ backgroundColor: "GrayText" }}
                                    >
                                        {callbacks?.map((item, index) => {
                                            const formattedDate = formatDateString(item?.schedule);

                                            var patientName
                                            patientsList?.forEach(patient => {
                                                if (patient.resourceId == item?.resourceId) {
                                                    patientName = patient.name
                                                }
                                            })
                                            if (item?.status === "scheduled") {
                                                return (
                                                    <List.Item key={index} className="listItem">
                                                        {patientName} | {formattedDate}
                                                        <lord-icon
                                                            src="https://cdn.lordicon.com/anqzffqz.json"
                                                            trigger="click"
                                                            state="morph"
                                                            style={{
                                                                width: "30px",
                                                                height: "30px",
                                                                float: "right",
                                                                marginRight: "30px",
                                                                marginBottom: "-10px",
                                                                cursor: "pointer"
                                                            }}
                                                            onClick={() => {
                                                                setIsOpen(true);
                                                                setSelectedItem(item);
                                                            }}
                                                        ></lord-icon>
                                                        <SpringModal isOpen={isOpen} setIsOpen={setIsOpen} selectedItem={selectedItem} name={patientName} date={item?.schedule}/>
                                                    </List.Item>
                                                );
                                            } else {
                                                return null; // No content for items with status other than "scheduled"
                                            }
                                        })}
                                    </List>
                                </div>

                                <div id="appointments" className="col-3">
                                    <TodoWrapper />
                                </div>
                            </div>
                            <Calendar bordered renderCell={renderCell} />
                        </div>
                    </Box>
                </div>
            </div>
        </>
    );
}

const SliderToggle = ({ selected, setSelected }) => {
    return (
      <div className="relative flex w-fit items-center rounded-full">
        <button
          className={`${TOGGLE_CLASSES} ${
            selected === "busy" ? "text-white" : "text-slate-800"
          }`}
          onClick={() => {
            setSelected("busy");
            send(
                conn,
                getSocketJson(
                    "connected:busy",
                    "changestate",
                    token,
                    counsellorRole,
                    patientRole
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
                conn,
                getSocketJson(
                    "busy:connected",
                    "changestate",
                    token,
                    counsellorRole,
                    patientRole
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

const SpringModal = ({ isOpen, setIsOpen, selectedItem, name, date }) => {
    console.log("Selected Item: ", selectedItem)
    var time = formatTime(date)
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="bg-slate-900/20 backdrop-blur p-8 fixed inset-0 z-50 grid place-items-center overflow-y-scroll cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0, rotate: "12.5deg" }}
              animate={{ scale: 1, rotate: "0deg" }}
              exit={{ scale: 0, rotate: "0deg" }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white p-6 rounded-lg w-full max-w-lg shadow-xl cursor-default relative overflow-hidden"
            >
              <FiAlertCircle className="text-white/10 rotate-12 text-[250px] absolute z-0 -top-24 -left-24" />
              <div className="relative z-10">
                <div className="bg-white w-16 h-16 mb-2 rounded-full text-3xl text-indigo-600 grid place-items-center mx-auto">
                  <FiAlertCircle />
                </div>
                <h3 className="text-3xl font-bold text-center mb-2">
                  Appointment!
                </h3>
                <p className="text-center mb-6 text-white text-xl">
                  Name: <span className="font-semibold">{name}</span>
                </p>
                
                <div>
                    <p style={{marginTop: "-20px", marginLeft: "20px"}} className="text-center mb-6 text-white text-xl">
                    Reason: <span className="font-semibold">{selectedItem.followupReason}</span>
                    </p>
                </div>

                <div>
                    <p style={{marginTop: "-20px", marginLeft: "-70px"}} className="text-center mb-6 text-white text-xl">
                    Time: <span className="font-semibold">{time}</span>
                    </p>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="bg-transparent hover:bg-white/10 transition-colors text-white font-semibold w-full py-2 rounded"
                  >
                    Close
                  </button>
                  <button
                    // onClick={() => setIsOpen(false)}
                    onClick={(e) => {
                                    send(
                                        conn,
                                        getSocketJson(
                                            "5",
                                            "connect",
                                            token,
                                            counsellorRole,
                                            patientRole
                                        )
                                    );
                                }}
                    className="bg-white hover:opacity-90 transition-opacity text-indigo-600 font-semibold w-full py-2 rounded"
                  >
                    Call
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

export default CounsellorDashboard;

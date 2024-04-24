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

defineElement(lottie.loadAnimation);

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

const adminRole = "ROLE_ADMIN",
    counsellorRole = "ROLE_COUNSELLOR",
    patientRole = "ROLE_PATIENT";
let conn, patientPeerConnection;
const connections = { conn: {}, peerConnection: {} };

function RevampedDashboard() {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role") || "ROLE_COUNSELLOR";
    const [showCallConnectingModal, setShowCallConnectingModal] =
        useState(false);
    const [showInCall, setShowIncall] = useState(false);

    const acceptIncommingCall = async () => {
        setTimeout(() => {
            setShowIncall(true);
            setShowCallConnectingModal(false);
        }, 3000);
        conn.destRole = patientRole;
        send(conn, getSocketJson("", "accept", token, role, patientRole));

        patientPeerConnection = await initiateWebRTC(conn, role, connections);
        connections.peerConnection = patientPeerConnection;
        patientPeerConnection.ontrack = (e) => {
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

    const declineIcommingCall = () => {
        send(conn, getSocketJson("", "decline", token, role, patientRole));
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

    return showInCall ? (
        <>
            <InCall
                conn={conn}
                peerconnection={patientPeerConnection}
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
                <Navbar
                    id="navv"
                    collapseOnSelect
                    expand="lg"
                    className="bg-body-tertiary"
                >
                    <Container id="container">
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
                                    <Button variant="dark">Logout</Button>{" "}
                                </Nav.Link>
                            </Nav>
                        </Navbar.Collapse>
                    </Container>
                </Navbar>

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
                                <div id="user">
                                    <img
                                        src={require("../../assets/curly-hair-man.png")}
                                        alt="user"
                                    />
                                </div>
                                <div>
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

                        <div className="row bgDash">
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
                                        <List.Item className="listItem">
                                            Rahul Sharma | 30th April
                                            <lord-icon
                                                src="https://cdn.lordicon.com/anqzffqz.json"
                                                trigger="click"
                                                state="morph-check"
                                                style={{
                                                    width: "30px",
                                                    height: "30px",
                                                    float: "right",
                                                    marginRight: "30px",
                                                    marginBottom: "-10px",
                                                }}
                                            ></lord-icon>
                                        </List.Item>
                                        <List.Item className="listItem">
                                            Arvind Kohli | 2nd May
                                            <lord-icon
                                                src="https://cdn.lordicon.com/anqzffqz.json"
                                                trigger="click"
                                                state="morph-check"
                                                style={{
                                                    width: "30px",
                                                    height: "30px",
                                                    float: "right",
                                                    marginRight: "30px",
                                                    marginBottom: "-10px",
                                                }}
                                            ></lord-icon>
                                        </List.Item>
                                        <List.Item className="listItem">
                                            Mann Singh | 16th May
                                            <lord-icon
                                                src="https://cdn.lordicon.com/anqzffqz.json"
                                                trigger="click"
                                                state="morph-check"
                                                style={{
                                                    width: "30px",
                                                    height: "30px",
                                                    float: "right",
                                                    marginRight: "30px",
                                                    marginBottom: "-10px",
                                                }}
                                            ></lord-icon>
                                        </List.Item>
                                        <List.Item className="listItem">
                                            Shashi Shastri | 3rd June
                                            <lord-icon
                                                src="https://cdn.lordicon.com/anqzffqz.json"
                                                trigger="click"
                                                state="morph-check"
                                                style={{
                                                    width: "30px",
                                                    height: "30px",
                                                    float: "right",
                                                    marginRight: "28px",
                                                    marginBottom: "-10px",
                                                }}
                                            ></lord-icon>
                                        </List.Item>
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

export default RevampedDashboard;

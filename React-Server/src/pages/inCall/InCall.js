import React, { useState, useCallback, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    Button,
    Card,
    Form,
    Col,
    Row,
    ListGroup,
    Modal,
} from "react-bootstrap";
import { FaMicrophone, FaCircle } from "react-icons/fa";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import FormGroup from "@mui/material/FormGroup";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import SelectBox from "devextreme-react/select-box";
import List from "devextreme-react/list";
import DynamicIsland from "./DynamicIsland.js";
import { products, searchModeLabel } from "./data.js";
import "./inCallStyle.css";
import "react-datepicker/dist/react-datepicker.css";
import {
    getSocketJson,
    handlePeerConnectionClose,
    send,
} from "../../utils/utils.js";

const adminRole = "ROLE_ADMIN",
    counsellorRole = "ROLE_COUNSELLOR",
    patientRole = "ROLE_PATIENT";
let conn, patientPeerConnection;
const connections = { conn: {}, peerConnection: {} };

function InCall({ conn, peerconnection, setShowIncall }) {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role") || "ROLE_COUNSELLOR";

    useEffect(() => {
        handlePeerConnectionClose(conn, peerconnection, handleEndCall);
    }, []);
    const handleEndCall = () => {
        console.log(
            "this is peerconnection",
            conn,
            peerconnection,
            setShowIncall
        );
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
        send(
            conn,
            getSocketJson("disconnect", "decline", token, role, patientRole)
        );
        setTimeout(() => {
            setShowIncall(false);
        }, 1000);
    };

    const today = new Date();
    const month = today.getMonth() + 1;
    const year = today.getFullYear();
    const date = today.getDate();
    const currentDate = date + "/" + month + "/" + year;

    const showTime =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

    const [show, setShow] = useState(false);
    const [showCard, setCardModal] = useState(false);
    const [showSchedule, setScheduleModal] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const showCardModal = () => setCardModal(true);
    const closeCardModal = () => setCardModal(false);

    const showScheduleModal = () => setScheduleModal(true);
    const closeScheduleModal = () => setScheduleModal(false);

    function ItemTemplate(data) {
        return (
            <div>
                <FaCircle
                    style={{
                        fontSize: "11px",
                        marginRight: "5px",
                        marginBottom: "2px",
                        color: `${data.Status}`,
                    }}
                />
                {data.Name}
            </div>
        );
    }
    const searchModes = ["contains", "startsWith", "equals"];

    const [searchMode, setSearchMode] = useState("contains");
    const onSearchModeChange = useCallback(
        (args) => {
            setSearchMode(args.value);
        },
        [setSearchMode]
    );

    return (
        <div id="parentElement">
            <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
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
                            <Nav.Link href="#features">Patient ID</Nav.Link>
                        </Nav>
                        {/* <LiveIsland>
                
            </LiveIsland> */}
                        <div
                            style={{
                                height: "30px",
                                zIndex: "2",
                                marginRight: "320px",
                            }}
                        >
                            <DynamicIsland />
                        </div>
                        <Nav>
                            <Nav.Link href="#deets">
                                <FaMicrophone
                                    style={{
                                        fontSize: "35px",
                                        marginTop: "3px",
                                        marginRight: "8px",
                                    }}
                                />
                            </Nav.Link>
                            <Nav.Link eventKey={2}>
                                <Button
                                    onClick={handleEndCall}
                                    variant="danger"
                                >
                                    END
                                </Button>{" "}
                            </Nav.Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>

            {/* The Form Body Starts */}

            <div className="row">
                <Card className="col-4 cards" style={{ marginLeft: "40px" }}>
                    <Card.Body>
                        <Form>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formGridEmail">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control placeholder="Enter Name" />
                                </Form.Group>

                                <Form.Group
                                    as={Col}
                                    controlId="formGridPassword"
                                >
                                    <Form.Label>Gender</Form.Label>
                                    <Form.Select>
                                        <option>Select</option>
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Others</option>
                                    </Form.Select>
                                </Form.Group>
                            </Row>

                            <Form.Group
                                className="mb-3"
                                controlId="formGridAddress1"
                            >
                                <Form.Label>Date Of Birth</Form.Label>
                                <LocalizationProvider
                                    dateAdapter={AdapterDayjs}
                                >
                                    <DemoContainer components={["DatePicker"]}>
                                        <DatePicker label="Choose DOB" />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Form.Group>

                            <Form.Group
                                className="mb-3"
                                controlId="formGridAddress2"
                            >
                                <Form.Label>Address</Form.Label>
                                <Form.Control placeholder="Apartment, studio, or floor" />
                            </Form.Group>

                            <Form.Group
                                className="mb-3"
                                controlId="formGridAddress2"
                            >
                                <Form.Label>Major Issues</Form.Label>
                                <Form.Control placeholder="Asthama, Diabetes..." />
                            </Form.Group>

                            <Form.Group
                                className="mb-3"
                                controlId="formGridAddress2"
                            >
                                <Form.Label>Minor Issues</Form.Label>
                                <Form.Control placeholder="..." />
                            </Form.Group>

                            <Form.Group
                                className="mb-3"
                                controlId="formGridAddress2"
                            >
                                <Form.Label>Allergies</Form.Label>
                                <Form.Control placeholder="..." />
                            </Form.Group>
                        </Form>
                    </Card.Body>
                </Card>

                <Card className="col-4 cards">
                    <Card.Body>
                        <Form>
                            <Form.Group
                                className="mb-3"
                                controlId="formGridAddress2"
                            >
                                <Form.Label>Prescription</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder=".."
                                />
                            </Form.Group>

                            <Form.Group
                                className="mb-3"
                                controlId="formGridAddress2"
                            >
                                <Form.Label>Symptoms</Form.Label>
                                <Form.Control placeholder="Asthama, Diabetes..." />
                            </Form.Group>

                            <Form.Group
                                className="mb-3"
                                controlId="formGridAddress2"
                            >
                                <Form.Label>Test Suggested</Form.Label>
                                <Form.Control placeholder="..." />
                            </Form.Group>

                            <Form.Group
                                className="mb-3"
                                controlId="formGridAddress2"
                            >
                                <Form.Label>Summary</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="..."
                                />
                            </Form.Group>

                            <Button
                                variant="info"
                                className="btnCard"
                                onClick={showScheduleModal}
                            >
                                Schedule Callback
                            </Button>

                            <Modal
                                show={showSchedule}
                                onHide={closeScheduleModal}
                            >
                                <Modal.Header closeButton>
                                    <Modal.Title>Schedule Callback</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <div className="row">
                                        <div className="col">
                                            <LocalizationProvider
                                                dateAdapter={AdapterDayjs}
                                            >
                                                <DemoContainer
                                                    components={["DatePicker"]}
                                                >
                                                    <DatePicker label="Choose Date" />
                                                </DemoContainer>
                                            </LocalizationProvider>
                                            <LocalizationProvider
                                                dateAdapter={AdapterDayjs}
                                            >
                                                <DemoContainer
                                                    components={["TimePicker"]}
                                                >
                                                    <TimePicker label="Select Time" />
                                                </DemoContainer>
                                            </LocalizationProvider>
                                            <FormGroup>
                                                <Form.Label
                                                    style={{
                                                        paddingTop: "20px",
                                                    }}
                                                >
                                                    Follow Up:
                                                </Form.Label>
                                                <Box
                                                    style={{
                                                        marginLeft: "-10px",
                                                    }}
                                                    component="form"
                                                    sx={{
                                                        "& > :not(style)": {
                                                            m: 1,
                                                            width: "25ch",
                                                        },
                                                    }}
                                                    noValidate
                                                    autoComplete="off"
                                                >
                                                    <TextField
                                                        id="filled-basic"
                                                        label="Reason"
                                                        variant="filled"
                                                    />
                                                </Box>
                                            </FormGroup>
                                        </div>
                                        <div className="col">
                                            <ListGroup as="ul">
                                                <ListGroup.Item
                                                    as="li"
                                                    active
                                                    style={{ top: "6px" }}
                                                >
                                                    Upcoming Appointments
                                                </ListGroup.Item>
                                                <ListGroup.Item as="li">
                                                    Date: {currentDate} Time:{" "}
                                                    {showTime}
                                                </ListGroup.Item>
                                                <ListGroup.Item as="li">
                                                    Date: {currentDate} Time:{" "}
                                                    {showTime}
                                                </ListGroup.Item>
                                                <ListGroup.Item as="li">
                                                    Date: {currentDate} Time:{" "}
                                                    {showTime}
                                                </ListGroup.Item>
                                            </ListGroup>
                                        </div>
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button
                                        variant="secondary"
                                        onClick={closeScheduleModal}
                                    >
                                        Close
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={closeScheduleModal}
                                    >
                                        Schedule
                                    </Button>
                                </Modal.Footer>
                            </Modal>

                            <Button
                                variant="info"
                                type="submit"
                                className="btnCard"
                            >
                                Ask Consent
                            </Button>

                            <Button
                                variant="info"
                                className="btnCard"
                                onClick={handleShow}
                            >
                                Contact S.D
                            </Button>

                            <Modal show={show} onHide={handleClose}>
                                <Modal.Header closeButton>
                                    <Modal.Title>
                                        Contact Senior Doctor
                                    </Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    {/* <ReactSearchBox
                                placeholder="Search"
                                value="Doe"
                                data={dataValue}
                                callback={(record) => console.log(record)}
                            /> */}

                                    <div className="list-container">
                                        <List
                                            dataSource={products}
                                            height={300}
                                            itemRender={ItemTemplate}
                                            searchExpr="Name"
                                            searchEnabled={true}
                                            searchMode={searchMode}
                                            onItemClick={showCardModal}
                                        />
                                    </div>
                                    <div className="options">
                                        <div className="caption">Options</div>
                                        <div className="option">
                                            <span>Search mode </span>
                                            <SelectBox
                                                items={searchModes}
                                                inputAttr={searchModeLabel}
                                                value={searchMode}
                                                onValueChanged={
                                                    onSearchModeChange
                                                }
                                            />
                                        </div>
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button
                                        variant="secondary"
                                        onClick={handleClose}
                                    >
                                        Close
                                    </Button>
                                </Modal.Footer>
                            </Modal>

                            <Modal show={showCard} onHide={closeCardModal}>
                                <div
                                    style={{
                                        backgroundColor: "lightgreen",
                                        height: "10px",
                                    }}
                                ></div>
                                <Modal.Body style={{ padding: "0px" }}>
                                    <Card style={{ width: "100%" }}>
                                        <Card.Img
                                            variant="top"
                                            src={require("../../assets/shinchanDoctor.jpeg")}
                                            style={{ height: "340px" }}
                                        />
                                        <Card.Body>
                                            <Card.Title>
                                                Dr. Shinchan
                                            </Card.Title>
                                            <Card.Text>
                                                Specialization:{" "}
                                                <b> Humourologist </b>
                                            </Card.Text>
                                        </Card.Body>
                                        <ListGroup className="list-group-flush">
                                            <ListGroup.Item>
                                                Hospital: Osaka Bin Laten
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                12+ years experience
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                Funny AF Award
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Card>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button
                                        variant="secondary"
                                        onClick={closeCardModal}
                                    >
                                        Close
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={closeCardModal}
                                    >
                                        Connect
                                    </Button>
                                </Modal.Footer>
                            </Modal>

                            <Button
                                variant="info"
                                type="submit"
                                className="btnCard"
                            >
                                Redirect Counselor
                            </Button>
                        </Form>
                    </Card.Body>
                </Card>

                <ListGroup
                    className="col-3 listHistory"
                    style={{ height: "590px", overflowY: "auto" }}
                >
                    <ListGroup.Item className="items">
                        <Card className="text-center">
                            <Card.Header>{currentDate}</Card.Header>
                            <Card.Body>
                                <Card.Title>Call Summary</Card.Title>
                                <Card.Text>
                                    With supporting text below as a natural
                                    lead-in to additional content.
                                </Card.Text>
                                <hr />
                                <Card.Title>Prescription</Card.Title>
                                <Card.Text>
                                    With supporting text below as a natural
                                    lead-in to additional content.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </ListGroup.Item>
                    <ListGroup.Item className="items">
                        <Card className="text-center">
                            <Card.Header>{currentDate}</Card.Header>
                            <Card.Body>
                                <Card.Title>Call Summary</Card.Title>
                                <Card.Text>
                                    With supporting text below as a natural
                                    lead-in to additional content.
                                </Card.Text>
                                <hr />
                                <Card.Title>Prescription</Card.Title>
                                <Card.Text>
                                    With supporting text below as a natural
                                    lead-in to additional content.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </ListGroup.Item>
                    <ListGroup.Item className="items">
                        <Card className="text-center">
                            <Card.Header>{currentDate}</Card.Header>
                            <Card.Body>
                                <Card.Title>Call Summary</Card.Title>
                                <Card.Text>
                                    With supporting text below as a natural
                                    lead-in to additional content.
                                </Card.Text>
                                <hr />
                                <Card.Title>Prescription</Card.Title>
                                <Card.Text>
                                    With supporting text below as a natural
                                    lead-in to additional content.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </ListGroup.Item>
                    <ListGroup.Item className="items">
                        Porta ac consectetur ac
                    </ListGroup.Item>
                    <ListGroup.Item className="items">
                        Vestibulum at eros
                    </ListGroup.Item>
                </ListGroup>
            </div>
        </div>
    );
}

export default InCall;

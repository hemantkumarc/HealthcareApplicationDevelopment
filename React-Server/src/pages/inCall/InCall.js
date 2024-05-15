import React, { useState, useCallback, useEffect } from "react";
import Container from "react-bootstrap/Container";
import { Nav, Navbar, NavDropdown } from "react-bootstrap";
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
import axios from "axios";
import dayjs from "dayjs";
import { getResponsePost, getResponsePut } from "../../utils/utils.js";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dropdown from "react-bootstrap/Dropdown";

import {
    getResponseGet,
    getSocketJson,
    handlePeerConnectionClose,
    send,
} from "../../utils/utils.js";
import { Link } from "react-router-dom";

const adminRole = "ROLE_ADMIN",
    counsellorRole = "ROLE_COUNSELLOR",
    patientRole = "ROLE_PATIENT",
    srDrRole = "ROLE_SENIORDR";

var srDrList;
var selectedItem;
var selectedCounsellor;
var counsellorsList;
var familyData;
var historyData;
var resId;
var patientList;
var pID = 0;
var counsellorCalls;
var srDrInCall;
var srDrOnline;
var cInCall;
var cOnline;
var srDrBusy;
var cBusy;
var pInCall;
var pOnline;
var inCallWaiting;
var missedCalls;
let newUserSelected;
//------------------------------------------------------------------------------------------------------------------------------

function InCall({
    conn,
    connections,
    setShowIncall,
    handleEndCall,
    getIsMuted,
    toggleMute,
    setIsMuted,
    patID,
}) {
    var peerconnection = connections.patientPeerConnection;
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role") || "ROLE_COUNSELLOR";

    const [getPatientFamily, setPatientFamily] = useState(null);
    const [selectedID, setSelectedID] = useState(0);
    const [title, setTitle] = useState("");
    // const [resId, setResId] = useState(0)

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTime, setSelectedTime] = useState(null);
    const [reason, setReason] = useState("");

    const [isOpen, setIsOpen] = useState(false);
    const [patientHistoryData, setPatientHistoryData] = useState([]);
    const [isPut, setPut] = useState(false);

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
    const [showRedirect, setRedirect] = useState(false);
    const [showSelectedRedirect, setSelectedRedirect] = useState(false);
    const [getPatientList, setPatientList] = useState([]);

    useEffect(() => {
        console.log(conn, peerconnection);
        handlePeerConnectionClose(
            conn,
            peerconnection,
            handleEndCall,
            patientRole
        );
        setIsMuted(false);
    }, []);

    useEffect(() => {
        getOnlineStatus();
        getSeniorDrs();
        getCounsellors();

        getFamilies();
        getPatients();
    }, []);

    const getPatients = async () => {
        let res = await getResponseGet("/springdatarest/patients");
        console.log("Patient Data", res?.data?._embedded?.patients);
        patientList = res?.data?._embedded?.patients;
        setPatientList(res?.data?._embedded?.patients);
        console.log("PATIENT LIST", patientList);
    };

    const getFamilies = async () => {
        let res = await getResponseGet(`/get_families?patient_id=${patID}`);
        setPatientFamily(res?.data);
        console.log("get families res: ", res, patID);
        console.log("Yeahh Patient Family", res?.data);
        if (`${res?.data[pID]?.name}` === "null") {
            setTitle("New User");
        } else {
            setTitle(`${res?.data[pID]?.id} - ${res?.data[pID]?.name}`);
        }

        familyData = res?.data;
        // setResId(familyData[pID].id)
        resId = familyData[pID]?.id;
        console.log("PatientID in Call ---------------", patID);
    };

    // const getPatientHistories = async () => {
    //     let res = await getResponseGet("/springdatarest/patientHistories");
    //     setPatientHistoryData(res.data._embedded.patientHistories);
    //     console.log("Patient Hitories: ", patientHistoryData);
    //     historyData = res?.data?._embedded?.patientHistories;
    //     console.log("Patient History Data, Var - historyData", historyData);
    // };

    const getCounsellors = async () => {
        let res = await getResponseGet("/springdatarest/counsellors");
        counsellorsList = res?.data?._embedded?.counsellors;
        console.log("Counsellors", counsellorsList);

        counsellorsList.forEach((counsellor) => {
            if (cInCall.includes(counsellor.resourceId)) {
                counsellor.state = "red";
            } else if (cOnline.includes(counsellor.resourceId)) {
                counsellor.state = "lightgreen";
                console.log("CounsellorState: ", counsellor.state);
            } else {
                counsellor.state = "grey";
            }
        });
    };

    const getSeniorDrs = async () => {
        let res = await getResponseGet("/springdatarest/seniorDrs");
        srDrList = res?.data?._embedded?.seniorDrs;
        console.log("Senior Doctors", srDrList);

        srDrList.forEach((doc) => {
            if (srDrInCall.includes(doc.resourceId)) {
                doc.state = "red";
            } else if (srDrOnline.includes(doc.resourceId)) {
                doc.state = "lightgreen";
            } else {
                doc.state = "grey";
            }
        });

        console.log("UList1", srDrList);
    };

    const getPatientByID = async () => {
        let res = await getResponseGet(
            `/springdatarest/patientHistories/search/byattributes?patientid=${resId}&consent=true`
        );
        setPatientHistoryData(res?.data?._embedded?.patientHistories);
        console.log("Patient Hitory" + `${resId}: `, patientHistoryData);
        historyData = res?.data?._embedded?.patientHistories;
        console.log("Patient History Data, Var - historyData", historyData);
    };

    const handleSelect = (eventKey) => {
        if (eventKey != "newUser") {
            setSelectedID(eventKey);
            pID = eventKey;
            console.log("eventKey", pID);
            setTitle(
                `${getPatientFamily[pID]?.id} - ${getPatientFamily[pID]?.name}`
            );
            console.log(
                `${pID} ${getPatientFamily[pID]?.id} - ${getPatientFamily[pID]?.name}`
            );
            resId = getPatientFamily[pID].id;
            // setResId(getPatientFamily[pID].id)
            getPatientByID();
            // setName(getName());
            // setAddress(getAddress());
            // setMajorIssues(getMajorIssues());
            // setMinorIssues(getMinorIssues());
            // setAllergies(getAllergies());
            // setPrescription(getPrescripton());
            // setSymptoms(getSymptoms());
            // setSummary(getSummary());

            //getPatientByID();
        } else {
            setTitle(`New User`);
        }
    };

    useEffect(() => {
        const timeout = setTimeout(() => {
            setName(getName());
            setAddress(getAddress());
            setMajorIssues(getMajorIssues());
            setMinorIssues(getMinorIssues());
            setAllergies(getAllergies());
            setPrescription(getPrescripton());
            setSymptoms(getSymptoms());
            setSummary(getSummary());
        }, 500);

        // Clear the timeout if the component unmounts before the 2 seconds
        return () => clearTimeout(timeout);
    }, [historyData]);

    const handleUser = () => {
        setPut(true);
        newUserSelected = "New User";
        setTitle("New User");
        setSelectedID(101);
        resId = 101;
        console.log("Heyyyyyy Newww Userrrr");
        console.log("TITLE CHANGED!", title);
        getName();
        getDOB();
        getAddress();
        getMajorIssues();
        getMinorIssues();
        getAllergies();
        getPrescripton();
        getSymptoms();
        getSummary();
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleTimeChange = (time) => {
        setSelectedTime(time);
    };

    const handleReasonChange = (event) => {
        setReason(event.target.value);
    };

    const handleSubmit = async () => {
        // Convert selected date and time to formatted strings
        const formattedDate = selectedDate
            ? dayjs(selectedDate).format("YYYY-MM-DD")
            : "";
        const formattedTime = selectedTime
            ? dayjs(selectedTime).format("HH:mm:ss")
            : "";

        // Do something with formattedDate, formattedTime, and reason
        console.log("Formatted Date:", formattedDate);
        console.log("Formatted Time:", formattedTime);
        console.log("Reason:", reason);

        const payload = {
            followupReason: reason,
            schedule: `${formattedDate}T${formattedTime}.000+00:00`,
            status: "scheduled",
            patient: "https://restapi/springdatarest/patients/2",
            counsellor: "https://restapi/springdatarest/counsellors/3",
        };

        // const postCallback = async () => {
        //     const postSchedule = await getResponsePost(
        //         '/springdatarest/callBacks',
        //         payload,
        //         { "Content-Type": "application/json" }
        //     );
        //     console.log(postSchedule?.status)
        // }
        // postCallback()

        let res = await getResponsePost("/springdatarest/callBacks", payload);
        if (res.status === 201) {
            console.log("Schedule Response: ", res);
            toast.success("Success: Your request was processed successfully!", {
                position: "top-right",
            });
            closeScheduleModal();
        }
    };

    const getOnlineStatus = async () => {
        let res = await getResponseGet("/onlinestatus");
        counsellorCalls = res?.data?.counsellorCalls;
        console.log("ONLINE_STATUS", res?.data);
        srDrInCall = res?.data?.ROLE_SENIORDR_incall;
        srDrOnline = res?.data?.ROLE_SENIORDR_online;
        cInCall = res?.data?.ROLE_COUNSELLOR_incall;
        cOnline = res?.data?.ROLE_COUNSELLOR_online;
    };

    //Patient History

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const showCardModal = (e) => {
        selectedItem = e.itemData;
        console.log("Selected Item: ", selectedItem);
        setCardModal(true);
    };

    const closeCardModal = () => setCardModal(false);

    const handleShowRedirect = () => {
        setRedirect(true);
    };

    const handleCloseRedirect = () => setRedirect(false);

    const handleShowSelectedRedirect = (e) => {
        selectedCounsellor = e.itemData;
        console.log("Selected Counsellor: ", selectedCounsellor);
        setSelectedRedirect(true);
    };

    const handleCloseSelectedRedirect = () => setSelectedRedirect(false);

    const showScheduleModal = () => setScheduleModal(true);
    const closeScheduleModal = () => setScheduleModal(false);

    // #7808d0
    const buttonStyle = {
        "--clr": "#6280e3",
        textDecoration: "none",
    };
    const buttonDisableStyle = {
        "--clr": "#c8ccdb",
        textDecoration: "none",
    };

    function ItemTemplate(srDrList) {
        return (
            <div className="row">
                <FaCircle
                    className="col-1"
                    style={{
                        fontSize: "11px",
                        marginRight: "3px",
                        marginTop: "5px",
                        color: `${srDrList.state}`,
                    }}
                />
                {srDrList?.name}
            </div>
        );
    }

    function counsellorItemTemplate(counsellorsList) {
        return (
            <div className="row">
                <FaCircle
                    className="col-1"
                    style={{
                        fontSize: "11px",
                        marginRight: "3px",
                        marginTop: "5px",
                        color: `${counsellorsList.state}`,
                    }}
                />
                {counsellorsList?.name}
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

    const [name, setName] = useState(getName());
    const [selectedGender, setSelectedGender] = useState("");
    const [address, setAddress] = useState(getAddress());
    const [majorIssues, setMajorIssues] = useState(getMajorIssues());
    const [minorIssues, setMinorIssues] = useState(getMinorIssues());
    const [allergies, setAllergies] = useState(getAllergies());
    const [prescription, setPrescription] = useState(getPrescripton());
    const [symptoms, setSymptoms] = useState(getSymptoms());
    const [testSuggested, setTestSuggested] = useState("...");
    const [summary, setSummary] = useState(getSummary());

    useEffect(() => {
        const timeout = setTimeout(() => {
            setName(getName());
            setAddress(getAddress());
            setMajorIssues(getMajorIssues());
            setMinorIssues(getMinorIssues());
            setAllergies(getAllergies());
            setPrescription(getPrescripton());
            setSymptoms(getSymptoms());
            setSummary(getSummary());
        }, 500);

        // Clear the timeout if the component unmounts before the 2 seconds
        return () => clearTimeout(timeout);
    }, [selectedID]);

    function getPrescripton() {
        console.log("Resource Id", resId);

        const prescriptionObjs = historyData?.filter(
            (item) => item.resourceId === resId
        );
        const placeholder = patientHistoryData[0]?.prescription
            ? patientHistoryData[0]?.prescription
            : "..";

        return placeholder;
    }

    function getSymptoms() {
        const symptomObjs = historyData?.filter(
            (item) => item.resourceId === resId
        );
        const placeholder = patientHistoryData[0]?.symptoms
            ? patientHistoryData[0]?.symptoms
            : "..";

        return placeholder;
    }

    function getSummary() {
        const summaryObjs = historyData?.filter(
            (item) => item.resourceId === resId
        );
        const placeholder = patientHistoryData[0]?.summanry
            ? patientHistoryData[0]?.summanry
            : "..";

        return placeholder;
    }

    function getName() {
        const nameObjs = patientList?.filter(
            (item) => item.resourceId === resId
        );
        const placeholder =
            nameObjs?.length > 0 ? nameObjs[0].name : "Enter Name";

        return placeholder;
    }

    function getGender() {
        const genderObjs = patientList?.filter(
            (item) => item.resourceId === resId
        );
        const placeholder =
            genderObjs?.length > 0 ? genderObjs[0].gender : "Select";

        return placeholder;
    }

    function getDOB() {
        const dobObjs = patientList?.filter(
            (item) => item.resourceId === resId
        );
        const placeholder = dobObjs?.length > 0 ? dobObjs[0].dob : "Choose DOB";

        return placeholder;
    }

    function getAddress() {
        const addressObjs = patientList?.filter(
            (item) => item.resourceId === resId
        );
        const placeholder =
            addressObjs?.length > 0
                ? addressObjs[0].location
                : "Apartment, studio, floor";

        const address1Objs = patientList?.filter(
            (item) => item.resourceId === resId
        );
        const placeholder1 =
            address1Objs?.length > 0 ? address1Objs[0].state : "";

        return `${placeholder}, ${placeholder1}`;
    }

    function getMajorIssues() {
        const majorObjs = patientList?.filter(
            (item) => item.resourceId === resId
        );
        const placeholder =
            majorObjs?.length > 0
                ? majorObjs[0].major_issues
                : "Asthama, Diabetes...";

        return placeholder;
    }

    function getMinorIssues() {
        const minorObjs = patientList?.filter(
            (item) => item.resourceId === resId
        );
        const placeholder =
            minorObjs?.length > 0 ? minorObjs[0].minor_issues : "...";

        return placeholder;
    }

    function getAllergies() {
        const allergyObjs = patientList?.filter(
            (item) => item.resourceId === resId
        );
        const placeholder =
            allergyObjs?.length > 0 ? allergyObjs[0].allergies : "...";

        return placeholder;
    }

    const handleGenderChange = (event) => {
        setSelectedGender(event.target.value);
    };

    const dataPayload = {
        name: name,
        gender: selectedGender,
        dob: "2024-04-01T05:00:00.000+00:00",
        location: address,
        state: address,
        major_issues: majorIssues,
        minor_issues: minorIssues,
        ph_no: "",
        language: "",
        allergies: allergies,
        blood_group: "",
        test_suggested: testSuggested,
    };

    const historyPayload = {
        symptoms: symptoms,
        summanry: summary,
        prescription: prescription,
        consent: "true",
        audio_recording: "",
        created: "2024-04-01T05:00:00.000+00:00",
        patient: `https://192.168.0.115/springdatarest/patientHistories/patient/${patID}`,
    };

    const handleAllDataSubmit = async () => {
        if (isPut) {
            const res = await getResponsePost(
                `/new_patient/${patID}`,
                dataPayload
            );
            if (res.status === 200) {
                console.log("Data Post Response: ", res);
                toast.success(
                    "Success: Your request was processed successfully!",
                    {
                        position: "top-right",
                    }
                );
            }

            const resHis = await getResponsePost(
                `/springdatarest/patientHistories`,
                historyPayload
            );

            if (resHis.status === 200) {
                console.log("History Post Response: ", resHis);
                toast.success(
                    "Success: Your request was processed successfully!",
                    {
                        position: "top-right",
                    }
                );
            }
        } else {
            const putResponse = await getResponsePut(
                `/new_patient/${patID}`,
                dataPayload
            );
            if (putResponse.status === 200) {
                console.log("PUT Response: ", putResponse);
                toast.success(
                    "Success: Your request was processed successfully!",
                    {
                        position: "top-right",
                    }
                );
            }

            const resHis = await getResponsePut(
                `/springdatarest/patientHistories/${resId}`,
                historyPayload
            );

            if (resHis.status === 200) {
                console.log("History Post Response: ", resHis);
                toast.success(
                    "Success: Your request was processed successfully!",
                    {
                        position: "top-right",
                    }
                );
            }
        }
        setPut(false);
    };

    return (
        <div id="parentElement">
            <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
                <Container>
                    <div id="logoInCall">
                        <img
                            src={require("../../assets/drVolteLogo.png")}
                            alt="logo"
                            style={{
                                height: "70px",
                                width: "87px",
                                marginLeft: "-60px",
                                marginTop: "20px",
                            }}
                        />
                    </div>
                    <Navbar.Brand style={{ marginLeft: "-50px" }} href="#home">
                        Dr.VoLTE
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav className="me-auto">
                            <NavDropdown
                                title={title ? title : "New User"}
                                id="basic-nav-dropdown"
                                onSelect={handleSelect}
                            >
                                {getPatientFamily?.map((item, index) => (
                                    <NavDropdown.Item
                                        key={index}
                                        eventKey={index}
                                    >
                                        {item.id} - {item.name}
                                    </NavDropdown.Item>
                                ))}
                                <Dropdown.Divider />
                                <NavDropdown.Item eventKey="newUser">
                                    <div className="row">
                                        <lord-icon
                                            className="col-6"
                                            src="https://cdn.lordicon.com/pdsourfn.json"
                                            trigger="hover"
                                            style={{
                                                width: "30px",
                                                height: "30px",
                                            }}
                                        ></lord-icon>
                                        <div
                                            style={{
                                                marginLeft: "9px",
                                                marginTop: "2px",
                                            }}
                                            className="col-6"
                                            onClick={handleUser}
                                        >
                                            Add User
                                        </div>
                                    </div>
                                </NavDropdown.Item>
                            </NavDropdown>
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
                            <button
                                type="button"
                                className="btn btn-light fs-4"
                                onClick={() => toggleMute()}
                            >
                                {!getIsMuted() ? (
                                    <lord-icon
                                        src="https://cdn.lordicon.com/jibstvae.json"
                                        trigger="in"
                                        delay="200"
                                        state="in-reveal"
                                        style={{
                                            width: "40px",
                                            height: "40px",
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
                                            width: "40px",
                                            height: "40px",
                                        }}
                                    ></lord-icon>
                                )}
                            </button>
                            <Nav.Link eventKey={2}>
                                <Button
                                    onClick={(e) => {
                                        // console.log("Data PAYLOAD", dataPayload)
                                        handleAllDataSubmit();
                                        handleEndCall();
                                    }}
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

            <div className="row mArea">
                <Card className="col-4 cards" style={{ marginLeft: "40px" }}>
                    <Card.Body>
                        <Form>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formGridEmail">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        placeholder={getName()}
                                        value={name}
                                        onChange={(e) =>
                                            setName(e.target.value)
                                        }
                                    />
                                </Form.Group>

                                <Form.Group
                                    as={Col}
                                    controlId="formGridPassword"
                                >
                                    <Form.Label>Gender</Form.Label>
                                    <Form.Select
                                        onChange={handleGenderChange}
                                        value={selectedGender}
                                    >
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
                                        <DatePicker label={"MM:DD:YYYY"} />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Form.Group>

                            <Form.Group
                                className="mb-3"
                                controlId="formGridAddress2"
                            >
                                <Form.Label>Address</Form.Label>
                                <Form.Control
                                    placeholder={getAddress()}
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                />
                            </Form.Group>

                            <Form.Group
                                className="mb-3"
                                controlId="formGridAddress2"
                            >
                                <Form.Label>Major Issues</Form.Label>
                                <Form.Control
                                    placeholder={getMajorIssues()}
                                    value={majorIssues}
                                    onChange={(e) =>
                                        setMajorIssues(e.target.value)
                                    }
                                />
                            </Form.Group>

                            <Form.Group
                                className="mb-3"
                                controlId="formGridAddress2"
                            >
                                <Form.Label>Minor Issues</Form.Label>
                                <Form.Control
                                    placeholder={getMinorIssues()}
                                    value={minorIssues}
                                    onChange={(e) =>
                                        setMinorIssues(e.target.value)
                                    }
                                />
                            </Form.Group>

                            <Form.Group
                                className="mb-3"
                                controlId="formGridAddress2"
                            >
                                <Form.Label>Allergies</Form.Label>
                                <Form.Control
                                    placeholder={getAllergies()}
                                    value={allergies}
                                    onChange={(e) =>
                                        setAllergies(e.target.value)
                                    }
                                />
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
                                    placeholder={getPrescripton()}
                                    value={prescription}
                                    onChange={(e) =>
                                        setPrescription(e.target.value)
                                    }
                                />
                            </Form.Group>

                            <Form.Group
                                className="mb-3"
                                controlId="formGridAddress2"
                            >
                                <Form.Label>Symptoms</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={2}
                                    placeholder={getSymptoms()}
                                    value={symptoms}
                                    onChange={(e) =>
                                        setSymptoms(e.target.value)
                                    }
                                />
                            </Form.Group>

                            <Form.Group
                                className="mb-3"
                                controlId="formGridAddress2"
                            >
                                <Form.Label>Test Suggested</Form.Label>
                                <Form.Control
                                    placeholder="..."
                                    value={testSuggested}
                                    onChange={(e) =>
                                        setTestSuggested(e.target.value)
                                    }
                                />
                            </Form.Group>

                            <Form.Group
                                className="mb-3"
                                controlId="formGridAddress2"
                            >
                                <Form.Label>Summary</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder={getSummary()}
                                    value={summary}
                                    onChange={(e) => setSummary(e.target.value)}
                                />
                            </Form.Group>

                            {/* <Button
                                variant="info"
                                className="btnCard"
                                onClick={showScheduleModal}
                            >
                                Schedule Callback
                            </Button> */}

                            {role === counsellorRole ? (
                                <Link
                                    id="callBack"
                                    style={buttonStyle}
                                    className="button"
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault(); // Prevent default behavior of navigating
                                        showScheduleModal(); // Call your click handling function
                                    }}
                                >
                                    <span className="button__icon-wrapper">
                                        <svg
                                            width="10"
                                            className="button__icon-svg"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 14 15"
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024"
                                            ></path>
                                        </svg>

                                        <svg
                                            className="button__icon-svg  button__icon-svg--copy"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="10"
                                            fill="none"
                                            viewBox="0 0 14 15"
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024"
                                            ></path>
                                        </svg>
                                    </span>
                                    Schedule Callback
                                </Link>
                            ) : (
                                <Link
                                    id="callBack"
                                    style={buttonDisableStyle}
                                    className="button"
                                    href="#"
                                    disabled
                                >
                                    <span className="button__icon-wrapper">
                                        <svg
                                            width="10"
                                            className="button__icon-svg"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 14 15"
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024"
                                            ></path>
                                        </svg>

                                        <svg
                                            className="button__icon-svg  button__icon-svg--copy"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="10"
                                            fill="none"
                                            viewBox="0 0 14 15"
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024"
                                            ></path>
                                        </svg>
                                    </span>
                                    Schedule Callback
                                </Link>
                            )}

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
                                                    <DatePicker
                                                        label="Choose Date"
                                                        value={selectedDate}
                                                        onChange={
                                                            handleDateChange
                                                        }
                                                        renderInput={(
                                                            params
                                                        ) => (
                                                            <TextField
                                                                {...params}
                                                            />
                                                        )}
                                                    />
                                                </DemoContainer>
                                            </LocalizationProvider>
                                            <LocalizationProvider
                                                dateAdapter={AdapterDayjs}
                                            >
                                                <DemoContainer
                                                    components={["TimePicker"]}
                                                >
                                                    <TimePicker
                                                        label="Select Time"
                                                        value={selectedTime}
                                                        onChange={
                                                            handleTimeChange
                                                        }
                                                        renderInput={(
                                                            params
                                                        ) => (
                                                            <TextField
                                                                {...params}
                                                            />
                                                        )}
                                                    />
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
                                                        value={reason}
                                                        onChange={
                                                            handleReasonChange
                                                        }
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
                                        onClick={handleSubmit}
                                    >
                                        Schedule
                                    </Button>
                                </Modal.Footer>
                            </Modal>

                            {role === counsellorRole ? (
                                <a
                                    style={buttonStyle}
                                    className="button"
                                    href="#"
                                    onClick={(e) => {
                                        send(
                                            conn,
                                            getSocketJson(
                                                "",
                                                "askConsent",
                                                token,
                                                counsellorRole,
                                                patientRole
                                            )
                                        );
                                    }}
                                >
                                    <span className="button__icon-wrapper">
                                        <svg
                                            width="10"
                                            className="button__icon-svg"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 14 15"
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024"
                                            ></path>
                                        </svg>

                                        <svg
                                            className="button__icon-svg  button__icon-svg--copy"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="10"
                                            fill="none"
                                            viewBox="0 0 14 15"
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024"
                                            ></path>
                                        </svg>
                                    </span>
                                    Ask Consent
                                </a>
                            ) : (
                                <a
                                    style={buttonDisableStyle}
                                    className="button"
                                    href="#"
                                    disabled
                                >
                                    <span className="button__icon-wrapper">
                                        <svg
                                            width="10"
                                            className="button__icon-svg"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 14 15"
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024"
                                            ></path>
                                        </svg>

                                        <svg
                                            className="button__icon-svg  button__icon-svg--copy"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="10"
                                            fill="none"
                                            viewBox="0 0 14 15"
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024"
                                            ></path>
                                        </svg>
                                    </span>
                                    Ask Consent
                                </a>
                            )}

                            {role === counsellorRole ? (
                                <a
                                    id="contactSD"
                                    style={buttonStyle}
                                    className="button"
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault(); // Prevent default behavior of navigating
                                        handleShow(); // Call your click handling function
                                    }}
                                >
                                    <span className="button__icon-wrapper">
                                        <svg
                                            width="10"
                                            className="button__icon-svg"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 14 15"
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024"
                                            ></path>
                                        </svg>

                                        <svg
                                            className="button__icon-svg  button__icon-svg--copy"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="10"
                                            fill="none"
                                            viewBox="0 0 14 15"
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024"
                                            ></path>
                                        </svg>
                                    </span>
                                    Contact S.D
                                </a>
                            ) : (
                                <a
                                    id="contactSD"
                                    style={buttonDisableStyle}
                                    className="button"
                                    href="#"
                                    disabled
                                >
                                    <span className="button__icon-wrapper">
                                        <svg
                                            width="10"
                                            className="button__icon-svg"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 14 15"
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024"
                                            ></path>
                                        </svg>

                                        <svg
                                            className="button__icon-svg  button__icon-svg--copy"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="10"
                                            fill="none"
                                            viewBox="0 0 14 15"
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024"
                                            ></path>
                                        </svg>
                                    </span>
                                    Contact S.D
                                </a>
                            )}

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
                                            dataSource={srDrList}
                                            height={300}
                                            itemRender={ItemTemplate}
                                            searchExpr="name"
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
                                        backgroundColor: `${selectedItem?.state}`,
                                        height: "10px",
                                    }}
                                ></div>
                                <Modal.Body style={{ padding: "0px" }}>
                                    <Card
                                        style={{ width: "100%", margin: "0px" }}
                                    >
                                        <Card.Img
                                            variant="top"
                                            src={require("../../assets/shinchanDoctor.jpeg")}
                                            style={{ height: "340px" }}
                                        />
                                        <Card.Body>
                                            <Card.Title>
                                                {selectedItem?.name}
                                            </Card.Title>
                                            <Card.Subtitle>
                                                Specialization:{" "}
                                                <b>
                                                    {" "}
                                                    {
                                                        selectedItem?.specialization
                                                    }{" "}
                                                </b>
                                            </Card.Subtitle>
                                        </Card.Body>
                                        <ListGroup className="list-group-flush">
                                            <ListGroup.Item>
                                                Hospital:{" "}
                                                {selectedItem?.hospital_name}
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                Qualification:{" "}
                                                {selectedItem?.qualification}
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                E-Mail: {selectedItem?.email}
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
                                        onClick={
                                            selectedItem?.state === "lightgreen"
                                                ? () => {
                                                      send(
                                                          conn,
                                                          getSocketJson(
                                                              `${selectedItem?.resourceId}`,
                                                              "redirectCounsellor",
                                                              token,
                                                              counsellorRole,
                                                              patientRole
                                                          )
                                                      );
                                                  }
                                                : closeCardModal
                                        }
                                    >
                                        Connect
                                    </Button>
                                </Modal.Footer>
                            </Modal>

                            {role === counsellorRole ? (
                                <a
                                    style={buttonStyle}
                                    className="button"
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault(); // Prevent default behavior of navigating
                                        handleShowRedirect(); // Call your click handling function
                                    }}
                                >
                                    <span className="button__icon-wrapper">
                                        <svg
                                            width="10"
                                            className="button__icon-svg"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 14 15"
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024"
                                            ></path>
                                        </svg>

                                        <svg
                                            className="button__icon-svg  button__icon-svg--copy"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="10"
                                            fill="none"
                                            viewBox="0 0 14 15"
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024"
                                            ></path>
                                        </svg>
                                    </span>
                                    Redirect Counsellor
                                </a>
                            ) : (
                                <a
                                    style={buttonDisableStyle}
                                    className="button"
                                    href="#"
                                    disabled
                                >
                                    <span className="button__icon-wrapper">
                                        <svg
                                            width="10"
                                            className="button__icon-svg"
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 14 15"
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024"
                                            ></path>
                                        </svg>

                                        <svg
                                            className="button__icon-svg  button__icon-svg--copy"
                                            xmlns="http://www.w3.org/2000/svg"
                                            width="10"
                                            fill="none"
                                            viewBox="0 0 14 15"
                                        >
                                            <path
                                                fill="currentColor"
                                                d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024"
                                            ></path>
                                        </svg>
                                    </span>
                                    Redirect Counsellor
                                </a>
                            )}

                            <Modal
                                show={showRedirect}
                                onHide={handleCloseRedirect}
                            >
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
                                            dataSource={counsellorsList}
                                            height={300}
                                            itemRender={counsellorItemTemplate}
                                            searchExpr="name"
                                            searchEnabled={true}
                                            searchMode={searchMode}
                                            onItemClick={
                                                handleShowSelectedRedirect
                                            }
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
                                        onClick={handleCloseRedirect}
                                    >
                                        Close
                                    </Button>
                                </Modal.Footer>
                            </Modal>

                            <Modal
                                show={showSelectedRedirect}
                                onHide={handleCloseSelectedRedirect}
                            >
                                <div
                                    style={{
                                        backgroundColor: `${selectedCounsellor?.state}`,
                                        height: "10px",
                                    }}
                                ></div>
                                <Modal.Body style={{ padding: "0px" }}>
                                    <Card
                                        style={{ width: "100%", margin: "0px" }}
                                    >
                                        <Card.Img
                                            variant="top"
                                            src={require("../../assets/shinchanDoctor.jpeg")}
                                            style={{ height: "340px" }}
                                        />
                                        <Card.Body>
                                            <Card.Title>
                                                {selectedCounsellor?.name}
                                            </Card.Title>
                                            <Card.Subtitle>
                                                Specialization:{" "}
                                                <b>
                                                    {" "}
                                                    {
                                                        selectedCounsellor?.specialization
                                                    }{" "}
                                                </b>
                                            </Card.Subtitle>
                                        </Card.Body>
                                        <ListGroup className="list-group-flush">
                                            <ListGroup.Item>
                                                Hospital:{" "}
                                                {
                                                    selectedCounsellor?.hospital_name
                                                }
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                Qualification:{" "}
                                                {
                                                    selectedCounsellor?.qualification
                                                }
                                            </ListGroup.Item>
                                            <ListGroup.Item>
                                                E-Mail:{" "}
                                                {selectedCounsellor?.email}
                                            </ListGroup.Item>
                                        </ListGroup>
                                    </Card>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button
                                        variant="secondary"
                                        onClick={handleCloseSelectedRedirect}
                                    >
                                        Close
                                    </Button>
                                    <Button
                                        variant="primary"
                                        onClick={
                                            selectedCounsellor?.state ===
                                            "lightgreen"
                                                ? () => {
                                                      send(
                                                          conn,
                                                          getSocketJson(
                                                              `${selectedCounsellor?.resourceId}`,
                                                              "redirectCounsellor",
                                                              token,
                                                              counsellorRole,
                                                              patientRole
                                                          )
                                                      );
                                                  }
                                                : handleCloseSelectedRedirect
                                        }
                                    >
                                        Connect
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </Form>
                    </Card.Body>
                </Card>

                <ListGroup
                    className="col-3 listHistory"
                    style={{ height: "590px", overflowY: "auto" }}
                >
                    {patientHistoryData?.map((item, index) => {
                        // Parse the date string
                        const parsedDate = new Date(item?.created);
                        // Format the date to your desired format (e.g., "YYYY-MM-DD")
                        const formattedDate = parsedDate
                            .toISOString()
                            .split("T")[0];

                        return (
                            <ListGroup.Item key={index} className="items">
                                <Card className="text-center">
                                    <Card.Header>{formattedDate}</Card.Header>
                                    <Card.Body>
                                        <Card.Title>Call Summary</Card.Title>
                                        <Card.Text>{item?.summanry}</Card.Text>
                                        <hr />
                                        <Card.Title>Prescription</Card.Title>
                                        <Card.Text>
                                            {item?.prescription}
                                        </Card.Text>
                                    </Card.Body>
                                </Card>
                            </ListGroup.Item>
                        );
                    })}
                </ListGroup>
            </div>
        </div>
    );
}

export default InCall;

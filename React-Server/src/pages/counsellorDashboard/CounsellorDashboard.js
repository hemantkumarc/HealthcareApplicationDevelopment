import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import "./counsellorDashStyle.css";
import { Button } from "react-bootstrap";
import { IoIosNotifications } from "react-icons/io";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import ReactBigCalendar from "./ReactBigCalendar";
import SwipeToRevealActions from "react-swipe-to-reveal-actions";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";

export default function CounsellorDashboard() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleDateClick = (arg) => {
    alert(arg.dateStr);
  };
  const patients = [
    { name: "Pappu", reason: "Bhulaaa", date: "14th Feb", time: "5:00 pm" },
    { name: "Mann", reason: "Alcoholic", date: "31st Dec", time: "2:00 am" },
    { name: "Kejriwal", reason: "Cough", date: "10th May", time: "10:00 am" },
  ];
  return (
    <div>
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
              <Nav.Link href="#features">Call History</Nav.Link>
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
                <Button onClick={handleLogout} variant="dark">
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
                  onClick: () => alert("Pressed the EDIT button"),
                },
                {
                  content: (
                    <div className="your-className-here">
                      <span>DELETE</span>
                    </div>
                  ),
                  onClick: () => alert("Pressed the DELETe button"),
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
  );
}

function renderEventContent(eventInfo) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}

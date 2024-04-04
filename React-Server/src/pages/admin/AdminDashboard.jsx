import React from "react";
import "./AdminDashboard.css";
import { useNavigate } from "react-router-dom";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import AdminDisableCounsellor from "./AdminDisableCounsellor";
import { IoIosNotifications } from "react-icons/io";
import { Button } from "react-bootstrap";
import Container from "react-bootstrap/Container";

const AdminDashboard = () => {
  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const navigate = useNavigate();
  return (
    <div className="admin-container">
      <Navbar
        style={{ top: "0px", width: "100%", position: "absolute" }}
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
            <Nav className="ms-auto">
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
      <div className="container">
        <button
          className="buttons"
          onClick={() => {
            navigate("/adminCreateCounsellor");
          }}
        >
          CREATE
        </button>
        <button
          className="buttons"
          onClick={() => {
            navigate(<AdminDisableCounsellor />);
          }}
        >
          DISABLE
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;

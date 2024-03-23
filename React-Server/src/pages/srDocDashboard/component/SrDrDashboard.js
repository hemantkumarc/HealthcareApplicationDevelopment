import React from "react";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../style/SrDrDashboard.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import drVolteLogo from "../../../assets/drVolteLogo.png";
// import api from "../api/axios";

export default function SrDrDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div>
      <header>
        <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
          <Container>
            <div id="logo">
              <img src={drVolteLogo} alt="logo" />
            </div>
            <Navbar.Brand href="#home">Dr.VoLTE</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
              <div className="container">
                <Nav>
                  <Nav.Link eventKey={2}>
                    <Button
                      onClick={handleLogout}
                      variant="dark"
                      id="lg-button"
                    >
                      Logout
                    </Button>
                  </Nav.Link>
                </Nav>
              </div>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
    </div>
  );
}
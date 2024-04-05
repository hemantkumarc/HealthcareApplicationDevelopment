import React from "react";
import "./DoctorNavBar.css";
import drVolteLogo from "../../../assets/drVolteLogo.png";
import { useNavigate } from "react-router-dom";
import SearchDoctor from "./SearchDoctor";
import { Navbar, Nav, Button, Container } from "react-bootstrap";

export default function DoctorNavBar({ setSearch }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      className="bg-body-tertiary"
      fixed="top"
    >
      <Container>
        <Navbar.Brand href="#home">
          <img src={drVolteLogo} alt="logo" className="img-logo" />
          Dr.VoLTE
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ml-auto" style={{ alignItems: "center" }}>
            <Nav.Link>
              <div className="search-container">
                <SearchDoctor setSearch={setSearch} />
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

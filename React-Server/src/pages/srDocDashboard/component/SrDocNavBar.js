import React from "react";
import { Navbar, Nav, Button, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import drVolteLogo from "../../../assets/drVolteLogo.png";

const SrDocNavBar = () => {
    const navigate = useNavigate();
  
    const handleLogout = () => {
      localStorage.removeItem("token");
      navigate("/");
    };
  
    return (
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
                    <Button onClick={handleLogout} variant="dark" id="lg-button">
                      Logout
                    </Button>
                  </Nav.Link>
                </Nav>
              </div>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </header>
    );
  }
  
  export default SrDocNavBar;
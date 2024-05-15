import React from "react";
import "./DoctorNavBar.css";
import drVolteLogo from "../../../assets/drVolteLogo.png";
import { useNavigate } from "react-router-dom";
import SearchDoctor from "./SearchDoctor";
import { Navbar, Nav, Button, Container } from "react-bootstrap";

export default function DoctorNavBar({ setSearch }) {
  const navigate = useNavigate();

  const [modalShow, setModalShow] = React.useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      className="bg-body-tertiary adnavbar-align"
      fixed="top"
    >
      <Container>
        <Navbar.Brand href="#home">
          <img style={{width: "130px"}} src={drVolteLogo} alt="logo" className="img-logo" />
        </Navbar.Brand>
        <Navbar.Text style={{marginLeft: "-45px", marginRight: "15px"}}>Dr.VoLTE</Navbar.Text>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/adminCreateCounsellor">Add Doctor</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link>
              <div className="search-container">
                <SearchDoctor setSearch={setSearch} />
              </div>
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
  );
}

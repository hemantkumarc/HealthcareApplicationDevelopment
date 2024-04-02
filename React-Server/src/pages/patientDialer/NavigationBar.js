import React from "react";
import { Navbar, Container, Nav, Button } from "react-bootstrap";
import { IoIosNotifications } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/drVolteLogo.png";
const NavigationBar = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/patientlogin");
    };

    return (
        <div>
            <Navbar collapseOnSelect expand="lg" className="bg-body-tertiary">
                <Container>
                    <div id="logo">
                        <img
                            src={logo}
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
                        <Nav className="me-auto"></Nav>
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
        </div>
    );
};
export default NavigationBar;

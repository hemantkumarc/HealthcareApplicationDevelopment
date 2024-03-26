import React, { useState, useCallback } from 'react'
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Card, Form, Col, Row, ListGroup, Modal} from "react-bootstrap";
import { FaMicrophone, FaCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import SelectBox from 'devextreme-react/select-box';
import List from 'devextreme-react/list';
import { products, searchModeLabel } from './data.js';
import "./inCallStyle.css";
import "react-datepicker/dist/react-datepicker.css";

function InCall() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const today = new Date();
    const month = today.getMonth()+1;
    const year = today.getFullYear();
    const date = today. getDate();
    const currentDate = date + "/" + month + "/" + year;

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function ItemTemplate(data) {
        return <div><FaCircle style={{
            fontSize: "11px",
            marginRight: "5px",
            marginBottom: "2px",
            color: `${data.Status}`
          }} /> 
          {data.Name}
          </div>;
      }
    const searchModes = ['contains', 'startsWith', 'equals'];

    const [searchMode, setSearchMode] = useState('contains');
    const onSearchModeChange = useCallback(
        (args) => {
        setSearchMode(args.value);
        },
        [setSearchMode],
    );

  return (
    <div id='parentElement'>
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
                <Button onClick={handleLogout} variant="danger">
                  END
                </Button>{" "}
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* The Form Body Starts */}

      <div className='row'>
        <Card className='col-4 cards' style={{marginLeft: "40px"}}>
            <Card.Body>
                <Form>
                    <Row className="mb-3">
                        <Form.Group as={Col} controlId="formGridEmail">
                        <Form.Label>Name</Form.Label>
                        <Form.Control placeholder="Enter Name" />
                        </Form.Group>

                        <Form.Group as={Col} controlId="formGridPassword">
                        <Form.Label>Gender</Form.Label>
                        <Form.Select>
                            <option>Select</option>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Others</option>
                        </Form.Select>
                        </Form.Group>
                    </Row>

                    <Form.Group className="mb-3" controlId="formGridAddress1">
                        <Form.Label>Date Of Birth</Form.Label>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DemoContainer components={['DatePicker']}>
                                <DatePicker label="Choose DOB" />
                            </DemoContainer>
                        </LocalizationProvider>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formGridAddress2">
                        <Form.Label>Address</Form.Label>
                        <Form.Control placeholder="Apartment, studio, or floor" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formGridAddress2">
                        <Form.Label>Major Issues</Form.Label>
                        <Form.Control placeholder="Asthama, Diabetes..." />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formGridAddress2">
                        <Form.Label>Minor Issues</Form.Label>
                        <Form.Control placeholder="..." />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formGridAddress2">
                        <Form.Label>Allergies</Form.Label>
                        <Form.Control placeholder="..." />
                    </Form.Group>
                </Form>
            </Card.Body>
        </Card>

        <Card className='col-4 cards'>
            <Card.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="formGridAddress2">
                        <Form.Label>Prescription</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder=".." />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formGridAddress2">
                        <Form.Label>Symptoms</Form.Label>
                        <Form.Control placeholder="Asthama, Diabetes..." />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formGridAddress2">
                        <Form.Label>Test Suggested</Form.Label>
                        <Form.Control placeholder="..." />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formGridAddress2">
                        <Form.Label>Summary</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder="..." />
                    </Form.Group>

                    <Button variant="info" type="submit" className='btnCard'>
                        Schedule Callback
                    </Button>

                    <Button variant="info" type="submit" className='btnCard'>
                        Ask Consent
                    </Button>

                    <Button variant="info" className='btnCard' onClick={handleShow}>
                        Contact S.D
                    </Button>

                    <Modal show={show} onHide={handleClose}>
                        <Modal.Header closeButton>
                        <Modal.Title>Contact Senior Doctor</Modal.Title>
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
                                    onValueChanged={onSearchModeChange}
                                />
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={handleClose}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleClose}>
                            Connect
                        </Button>
                        </Modal.Footer>
                    </Modal>

                    <Button variant="info" type="submit" className='btnCard'>
                        Redirect Counselor
                    </Button>
                </Form>
            </Card.Body>
        </Card>
        
        <ListGroup className='col-3 listHistory' style={{ height: '590px', overflowY: 'auto' }}>
            <ListGroup.Item className='items'>
                <Card className="text-center">
                    <Card.Header>{currentDate}</Card.Header>
                    <Card.Body>
                        <Card.Title>Call Summary</Card.Title>
                        <Card.Text>
                        With supporting text below as a natural lead-in to additional content.
                        </Card.Text>
                        <hr /> 
                        <Card.Title>Prescription</Card.Title>
                        <Card.Text>
                        With supporting text below as a natural lead-in to additional content.
                        </Card.Text>
                    </Card.Body>
                </Card>
            </ListGroup.Item>
            <ListGroup.Item className='items'>
                <Card className="text-center">
                    <Card.Header>{currentDate}</Card.Header>
                    <Card.Body>
                        <Card.Title>Call Summary</Card.Title>
                        <Card.Text>
                        With supporting text below as a natural lead-in to additional content.
                        </Card.Text>
                        <hr /> 
                        <Card.Title>Prescription</Card.Title>
                        <Card.Text>
                        With supporting text below as a natural lead-in to additional content.
                        </Card.Text>
                    </Card.Body>
                </Card>
            </ListGroup.Item>
            <ListGroup.Item className='items'>
                <Card className="text-center">
                    <Card.Header>{currentDate}</Card.Header>
                    <Card.Body>
                        <Card.Title>Call Summary</Card.Title>
                        <Card.Text>
                        With supporting text below as a natural lead-in to additional content.
                        </Card.Text>
                        <hr /> 
                        <Card.Title>Prescription</Card.Title>
                        <Card.Text>
                        With supporting text below as a natural lead-in to additional content.
                        </Card.Text>
                    </Card.Body>
                </Card>
            </ListGroup.Item>
            <ListGroup.Item className='items'>Porta ac consectetur ac</ListGroup.Item>
            <ListGroup.Item className='items'>Vestibulum at eros</ListGroup.Item>
        </ListGroup>
      </div>
    </div>
  )
}

export default InCall
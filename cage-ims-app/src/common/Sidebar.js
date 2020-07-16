import React, { Component } from "react";
import {
  Navbar,
  Nav,
  NavDropdown,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import { Container, Row, Col, Card } from "react-bootstrap";

export class Sidebar extends Component {
  render() {
    const mystyle = {
      color: "white",
      backgroundColor: "DodgerBlue",
      padding: "10px",
      fontFamily: "Arial",
    };
    return (
      <Container>
        <Row>
          <Col xs={3}>
            <Nav.Link style={mystyle} href="#home">
              Home
            </Nav.Link>
          </Col>
        </Row>
        <Row>
          <Col xs={3}>
            {" "}
            <Nav.Link style={mystyle} href="#Users">
              Users
            </Nav.Link>
          </Col>
        </Row>
        <Row>
          <Col xs={3}>
            <Nav.Link style={mystyle} href="#Inventory">
              Inventory
            </Nav.Link>
          </Col>
        </Row>
        <Row>
          <Col xs={3}>
            <Nav.Link style={mystyle} href="#Check In/Out">
              Check In/Out
            </Nav.Link>
          </Col>
        </Row>
        <Row>
          <Col xs={3}>
            <Nav.Link style={mystyle} href="#Manage Staff">
              Manage Staff
            </Nav.Link>
          </Col>
        </Row>
      </Container>
    );
  }
}

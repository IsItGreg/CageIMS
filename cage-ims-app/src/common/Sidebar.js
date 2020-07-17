import React, { Component } from "react";
import { Icon, Button, Menu, Segment, Image } from "semantic-ui-react";
import { Container, Row, Col, Nav, Navbar } from "react-bootstrap";
import { Link } from "react-router-dom";

class Sidebar extends Component {
  render() {
    const mystyle = {
      color: "white",
      fontFamily: "Roboto",
      fontSize: "large",
      background: "#93AAB8",
    };

    return (
      <Navbar variant="dark" className="sidebar flex-column">
        <Nav className="flex-column">
          <Nav.Item>
            <Nav.Link href="#/">
              <h4>
                <Icon name="home icon" />
                Home
              </h4>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#/checkinout">
              <h4>
                <Icon name="sync" />
                Check In/Out
              </h4>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#/users">
              <h4>
                <Icon name="users" />
                Users
              </h4>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#/inventory">
              <h4>
                <Icon name="camera" />
                Inventory
              </h4>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#/staff">
              <h4>
                <Icon name="user" />
                Staff
              </h4>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link href="#/transactions">
              <h4>
                <Icon name="history" />
                Transactions
              </h4>
            </Nav.Link>
          </Nav.Item>
        </Nav>
      </Navbar>
    );
  }
}

export default Sidebar;

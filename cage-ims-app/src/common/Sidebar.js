import React, { Component } from "react";
import { Icon, Button, Menu, Sidebar, Segment, Image } from "semantic-ui-react";
import { Container, Row, Col, NavItem, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

class MySidebar extends Component {
  render() {
    const mystyle = {
      color: "white",
      fontFamily: "Roboto",
      fontSize: "large",
      background: "#93AAB8",
    };

    return (
      <Row>
        <Nav className="sidebar sidebar-sticky">
          <Col className="sidebar-menu">
            <Nav.Item>
              <Nav.Link href="/home">
                <Icon name="home icon" />
                Home
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/check">
                <Icon name="sync" />
                Check In/Out
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/users">
                <Icon name="users" />
                Users
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/inventory">
                <Icon name="camera" />
                Inventory
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/staff">
                <Icon name="user" />
                Staff
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link href="/history">
                <Icon name="history" />
                Transactions
              </Nav.Link>
            </Nav.Item>
          </Col>
        </Nav>
      </Row>
    );
  }
}

export default MySidebar;

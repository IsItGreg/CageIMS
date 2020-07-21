import React, { Component } from "react";
import { BrowserRouter as Router, Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { Dropdown, Icon } from "semantic-ui-react";

const sampleUser = { firstName: "User", lastName: "Name" };

const trigger = (
  <h3>
    User Name <Icon name="chevron down" />
  </h3>
);

class Header extends Component {
  render() {
    return (
      <Row className="header">
        <Col>
          <h2>
            <Icon name="camera" />
            CageIMS
          </h2>
        </Col>
        <Col>
          <Dropdown
            className="header-dropdown"
            trigger={trigger}
            icon={null}
            direction="left"
          >
            <Dropdown.Menu>
              <Dropdown.Item icon="settings" text="Settings" />
              <Dropdown.Item
                icon="sign-out"
                text="Sign Out"
                as={Link}
                to="/logout"
              />
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
    );
  }
}

export default Header;

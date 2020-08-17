import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Nav } from "react-bootstrap";
import { Dropdown, Icon } from "semantic-ui-react";

// const sampleUser = { firstName: "User", lastName: "Name" };

const trigger = (
  <h3>
    User Name <Icon name="chevron down" />
  </h3>
);

class Header extends Component {
  constructor(props) {
    super(props);
    this.onClickHomeButton = this.onClickHomeButton.bind(this);
  }
  onClickHomeButton() {
    this.props.setPage("checkinout");
  }

  render() {
    return (
      <Row className="header">
        <Col>
          <Nav.Link href="#/" onClick={this.onClickHomeButton}>
            <h2>
              <Icon name="camera" />
              CageIMS
            </h2>
          </Nav.Link>
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

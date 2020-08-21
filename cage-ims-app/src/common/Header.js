import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
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
    this.state = {
      curTime: new Date()
        .toLocaleString(
          [],
          ("en-US",
          {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
        )
        .split(",")
        .join("\t"),
    };
  }

  componentDidMount() {
    setInterval(() => {
      this.setState({
        curTime: new Date()
          .toLocaleString(
            [],
            ("en-US",
            {
              weekday: "short",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })
          )
          .split(",")
          .join("\t"),
      });
    }, 1000);
  }

  render() {
    return (
      <Row
        className="header align-items-center"
        style={{ display: "flex", flexDirection: "row" }}
      >
        <Col>
          <h2>
            <Icon name="camera" />
            CageIMS
          </h2>
        </Col>
        <Col xs={{ span: 3, offset: 3 }}>
          <div>
            <h5>{this.state.curTime}</h5>
          </div>
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

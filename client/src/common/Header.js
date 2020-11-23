import React, { Component } from "react";
import { Row, Col, Nav } from "react-bootstrap";
import { Dropdown, Icon } from "semantic-ui-react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { logoutUser } from "../actions/authActions";
import { ReactComponent as Logo } from "./cagelogo.svg";
import { SvgIcon } from "@material-ui/core";

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
    this.setState({
      clockIntervalId: setInterval(() => {
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
      }, 1000),
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.clockIntervalId);
  }

  onLogoutClick = e => {
    e.preventDefault();
    this.props.logoutUser();
  };

  render() {
    const { user } = this.props.auth;
    const trigger = (
      <h3>
         {user.fname} {user.lname} <Icon name="chevron down" />
      </h3>
    );

    return (
      <Row
        className="header align-items-center"
        style={{ display: "flex", flexDirection: "row" }}
        noGutters
      >
        <Col fluid="true">
          <Nav.Link href="#/">
            <h2>
              <SvgIcon
                component={Logo}
                fontSize="small"
                viewBox="0 0 80 80"
                style={{ width: "55px", height: "45px" }}
              />
              CageIMS
            </h2>
          </Nav.Link>
        </Col>
        <Col xs="auto">
          <div style={{textAlign: "right"}}>
            <h5>{this.state.curTime}</h5>
          </div>
        </Col>
        <Col xs="auto">
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
                onClick={this.onLogoutClick}
              />
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>
    );
  }
}

Header.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logoutUser }
)(Header);
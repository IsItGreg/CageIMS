import React, { Component } from "react";
import { Icon } from "semantic-ui-react";
import { Nav, Navbar, Dropdown } from "react-bootstrap";
import { withRouter } from "react-router-dom";

class Sidebar extends Component {
  render() {
    return (
      <Navbar variant="light" className="sidebar flex-column">
        <Nav variant="pills" className="flex-column">
          <Nav.Item>
            <Nav.Link href="#/" active={this.props.location.pathname === "/"}>
              <h5>
                <Icon name="handshake" />
                Check In/Out
              </h5>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              href="#/users"
              active={this.props.location.pathname === "/users"}
            >
              <h5>
                <Icon name="users" />
                Users
              </h5>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              href="#/inventory"
              active={this.props.location.pathname === "/inventory"}
            >
              <h5>
                <Icon name="camera" />
                Inventory
              </h5>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              href="#/transactions"
              active={this.props.location.pathname === "/transactions"}
            >
              <h5>
                <Icon name="book" />
                History
              </h5>
            </Nav.Link>
          </Nav.Item>
          {/* <Nav.Item>
            <Nav.Link
              href="#/staff"
              active={this.props.location.pathname === "/staff"}
            >
              <h5>
                <Icon name="briefcase" />
                Staff
              </h5>
            </Nav.Link>
          </Nav.Item> */}
          <Dropdown.Divider />
        </Nav>
      </Navbar>
    );
  }
}

export default withRouter(Sidebar);

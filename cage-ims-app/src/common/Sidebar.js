import React, { Component } from "react";
import { Icon } from "semantic-ui-react";
import { Nav, Navbar } from "react-bootstrap";
import { withRouter } from "react-router-dom";

class Sidebar extends Component {
  render() {
    return (
      <Navbar variant="dark" className="sidebar flex-column">
        <Nav className="flex-column">
          <Nav.Item>
            <Nav.Link href="#/" active={this.props.location.pathname === "/"}>
              <h4>
                <Icon name="sync" />
                Check In/Out
              </h4>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              href="#/users"
              active={this.props.location.pathname === "/users"}
            >
              <h4>
                <Icon name="users" />
                Users
              </h4>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              href="#/inventory"
              active={this.props.location.pathname === "/inventory"}
            >
              <h4>
                <Icon name="camera" />
                Inventory
              </h4>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              href="#/staff"
              active={this.props.location.pathname === "/staff"}
            >
              <h4>
                <Icon name="user" />
                Staff
              </h4>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              href="#/transactions"
              active={this.props.location.pathname === "/transactions"}
            >
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

export default withRouter(Sidebar);

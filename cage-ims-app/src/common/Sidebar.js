import React, { Component } from "react";
import { Icon } from "semantic-ui-react";
import { Nav, Navbar } from "react-bootstrap";

class Sidebar extends Component {
  render() {
    return (
      <Navbar variant="dark" className="sidebar flex-column">
        <Nav className="flex-column">
          <Nav.Item>
            <Nav.Link
              href="#/"
              active={this.props.activePage === "checkinout" ? true : false}
            >
              <h4>
                <Icon name="sync" />
                Check In/Out
              </h4>
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link
              href="#/users"
              active={this.props.activePage === "users" ? true : false}
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
              active={this.props.activePage === "inventory" ? true : false}
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
              active={this.props.activePage === "staff" ? true : false}
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
              active={this.props.activePage === "transactions" ? true : false}
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

export default Sidebar;

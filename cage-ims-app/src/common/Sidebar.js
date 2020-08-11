import React, { Component } from "react";
import { Icon } from "semantic-ui-react";
import { Nav, Navbar } from "react-bootstrap";

class Sidebar extends Component {
  render() {
    return (
      <Navbar variant="dark" className="sidebar flex-column">
        <Nav className="flex-column">
          <Nav.Item>
            <Nav.Link href="#/">
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

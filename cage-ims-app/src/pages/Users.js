import React, { Component } from "react";
import { Divider, Button } from "semantic-ui-react";
import { Row, Modal, Col } from "react-bootstrap";
import Table from "../common/Table";

class Users extends Component {
  state = { open: false };

  show = (size) => () => this.setState({ size, open: true });
  close = () => this.setState({ open: false });

  render() {
    const { open, size } = this.state;
    return (
      <div className="userspage">
        <Col>
          <Button basic onClick={this.show("tiny")}>
            Add User
          </Button>
          <Divider clearing />
          <Modal show={open} onHide={this.close}>
            <Modal.Header closeButton>
              <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              Woohoo, you're reading this text in a modal!
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.close}>
                Close
              </Button>
              <Button variant="primary" onClick={this.close}>
                Save Changes
              </Button>
            </Modal.Footer>
            `
          </Modal>
          <h1>Users</h1>
          <Table data={this.dataSet} columns={this.columnSet}></Table>
        </Col>
      </div>
    );
  }

  columnSet = [
    { title: "First Name", field: "fname" },
    { title: "Last Name", field: "lname" },
    { title: "Course", field: "course" },
  ];

  dataSet = [
    { fname: "Seamus", lname: "Rioux", course: "Photography I Photography II" },
    { fname: "Greg", lname: "Smelkov", course: "Photography I" },
  ];
}

export default Users;

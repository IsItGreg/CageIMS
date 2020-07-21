import React, { Component, setState } from "react";
import { Divider, Button, Input, Form, List } from "semantic-ui-react";
import { Modal, Col } from "react-bootstrap";
import Table from "../common/Table";

class Users extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      dataSet: [
        {
          fname: "Seamus",
          lname: "Rioux",
          courses: ["Photography I", "Photography II"],
          id: "54321",
        },
        {
          fname: "Greg",
          lname: "Smelkov",
          courses: ["Photography I"],
          id: "12345",
        },
      ],
      columnSet: [
        { title: "First Name", field: "fname" },
        { title: "Last Name", field: "lname" },
        { title: "Courses", field: "courses" },
      ],
      open: false,
      selectedUserId: null,
      selectedUser: null,
    };
  }
  close = () => this.setState({ selectedUserId: null, selectedUser: null });

  handleChange = (e, userProp) => {
    const val = e.target.value;
    this.setState((prevState) => {
      let selectedUser = Object.assign({}, prevState.selectedUser);
      selectedUser[userProp] = val;
      return { selectedUser };
    });
  };

  handleUserSelectClick = (e, rowData) => {
    this.setState({
      selectedUserId: rowData.tableData.id,
      selectedUser: this.state.dataSet[rowData.tableData.id],
    });
  };

  handleAddUserClick = () => {
    this.setState({ selectedUserId: -1 });
  };

  handleSubmitClick = () => {
    this.setState((prevState) => {
      let dataSet = Array.from(prevState.dataSet);
      if (this.state.selectedUserId >= 0) {
        dataSet[this.state.selectedUserId] = this.state.selectedUser;
      } else {
        dataSet.push(this.state.selectedUser);
      }
      return { dataSet };
    });

    this.close();
  };

  render() {
    const selectedUserId = this.state.selectedUserId;
    const selectedUser = this.state.selectedUser ?? {
      fname: "",
      lname: "",
      courses: [],
      id: "",
    };
    return (
      <div className="userspage">
        <Col>
          <Button basic onClick={this.handleAddUserClick}>
            Create New User
          </Button>
          <Divider clearing />
          <Modal centered show={selectedUserId != null} onHide={this.close}>
            <Modal.Header closeButton bsPrefix="modal-header">
              <Modal.Title>
                {this.state.selectedUserId >= 0
                  ? "Edit User"
                  : "Create New User"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Field>
                  <label>First Name:</label>
                  <Input
                    type="fname"
                    placeholder="First Name"
                    defaultValue={selectedUser.fname}
                    onChange={(e) => {
                      this.handleChange(e, "fname");
                    }}
                  ></Input>
                </Form.Field>
                <Form.Field>
                  <label>Last Name:</label>
                  <Input
                    type="lname"
                    placeholder="Last Name"
                    defaultValue={selectedUser.lname}
                    onChange={(e) => {
                      this.handleChange(e, "lname");
                    }}
                  ></Input>
                </Form.Field>
                <Form.Field>
                  <label>Courses:</label>
                  <Input
                    type="courses"
                    placeholder="Courses"
                    defaultValue={selectedUser.courses}
                    onChange={(e) => {
                      this.handleChange(e, "courses");
                    }}
                  ></Input>{" "}
                  {/* TODO: change input type to searchable multiselect dropdown */}
                </Form.Field>
                <Form.Field>
                  <label>UML ID:</label>
                  <Input
                    type="id"
                    placeholder="UML ID"
                    defaultValue={selectedUser.id}
                    onChange={(e) => {
                      this.handleChange(e, "id");
                    }}
                  ></Input>
                </Form.Field>
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.close}>
                Close
              </Button>
              <Button
                id="add-icon-handler"
                variant="primary"
                onClick={this.handleSubmitClick}
              >
                Submit
              </Button>
            </Modal.Footer>
          </Modal>
          <Table
            data={Array.from(this.state.dataSet)}
            columns={this.state.columnSet}
            title={<h2>Users</h2>}
            onRowClick={(event, rowData) =>
              this.handleUserSelectClick(event, rowData)
            }
          ></Table>
        </Col>
      </div>
    );
  }
}

export default Users;

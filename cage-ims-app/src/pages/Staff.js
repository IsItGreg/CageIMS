import React, { Component, setState } from "react";
import { Divider, Button, Form } from "semantic-ui-react";
import { Modal, Col } from "react-bootstrap";
import Table from "../common/Table";

class Staff extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      dataSet: [
        {
          fname: "Seamus",
          lname: "Rioux",
          roles: "Admin",
          courses: ["Photography I", "Photography II"],
          id: "54321",
          email: "seamus.rioux3@gmail.com",
        },
        {
          fname: "Greg",
          lname: "Smelkov",
          roles: "Admin",
          courses: ["Photography I"],
          id: "12345",
          email: "greg@gmail.com",
        },
      ],
      columnSet: [
        { title: "First Name", field: "fname" },
        { title: "Last Name", field: "lname" },
        { title: "Courses", field: "courses" },
        { title: "Roles", field: "roles" },
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
      roles: "",
      courses: [],
      id: "",
      email: "",
    };
    return (
      <div className="userspage">
        <Col>
          <Button basic onClick={this.handleAddUserClick}>
            Create New Staff
          </Button>
          <Divider clearing />
          <Modal centered show={selectedUserId != null} onHide={this.close}>
            <Modal.Header closeButton bsPrefix="modal-header">
              <Modal.Title>
                {this.state.selectedUserId >= 0
                  ? "Edit Staff"
                  : "Create New Staff"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Field>
                  <label>First Name:</label>
                  <Form.Input
                    type="fname"
                    placeholder="First Name"
                    defaultValue={selectedUser.fname}
                    onChange={(e) => {
                      this.handleChange(e, "fname");
                    }}
                  ></Form.Input>
                </Form.Field>
                <Form.Field>
                  <label>Last Name:</label>
                  <Form.Input
                    type="lname"
                    placeholder="Last Name"
                    defaultValue={selectedUser.lname}
                    onChange={(e) => {
                      this.handleChange(e, "lname");
                    }}
                  ></Form.Input>
                </Form.Field>
                <Form.Field>
                  <label>Courses:</label>
                  <Form.Input
                    type="courses"
                    placeholder="Courses"
                    defaultValue={selectedUser.courses}
                    onChange={(e) => {
                      this.handleChange(e, "courses");
                    }}
                  ></Form.Input>{" "}
                  {/* TODO: change input type to searchable multiselect dropdown */}
                </Form.Field>
                <Form.Field>
                  <label>Roles:</label>
                  <Form.Input
                    type="roles"
                    placeholder="Roles"
                    defaultValue={selectedUser.roles}
                    onChange={(e) => {
                      this.handleChange(e, "roles");
                    }}
                  ></Form.Input>
                </Form.Field>
                <Form.Field>
                  <label>UML ID:</label>
                  <Form.Input
                    type="id"
                    placeholder="UML ID"
                    defaultValue={selectedUser.id}
                    onChange={(e) => {
                      this.handleChange(e, "id");
                    }}
                  ></Form.Input>
                </Form.Field>
                <Form.Field>
                  <label>Email:</label>
                  <Form.Input
                    type="email"
                    placeholder="Email"
                    defaultValue={selectedUser.email}
                    onChange={(e) => {
                      this.handleChange(e, "email");
                    }}
                  ></Form.Input>
                </Form.Field>
              </Form>
            </Modal.Body>
            <Modal.Footer>
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

export default Staff;

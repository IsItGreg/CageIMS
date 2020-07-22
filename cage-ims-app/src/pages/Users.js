import React, { Component, setState } from "react";
import { Divider, Button, Form, Dropdown } from "semantic-ui-react";
import { Col, Row, Modal } from "react-bootstrap";
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
          email: "seamus.rioux3@gmail.com",
          phone: "123-456-7890",
        },
        {
          fname: "Greg",
          lname: "Smelkov",
          courses: ["Photography I"],
          id: "12345",
          email: "greg@gmail.com",
          phone: "123-456-7890",
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
      courseOptions: [
        { text: "Photography I", value: "Photography I" },
        { text: "Photography II", value: "Photography II" },
        { text: "Documentary Image", value: "Documentary Image" },
      ],
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

  handleDropdownAddition = (e, { value }) => {
    this.setState((prevState) => ({
      courseOptions: [{ text: value, value }, ...prevState.courseOptions],
    }));
  };

  handleDropdownChange = (e, { value }) => {
    const val = value;
    this.setState((prevState) => {
      let selectedUser = Object.assign({}, prevState.selectedUser);
      selectedUser.courses = val;
      return { selectedUser };
    });
  };

  render() {
    const selectedUserId = this.state.selectedUserId;
    const selectedUser = this.state.selectedUser ?? {
      fname: "",
      lname: "",
      courses: [],
      id: "",
      email: "",
      phone: "",
    };
    const courseOptions = this.state.courseOptions;
    return (
      <div className="userspage">
        <Col>
          <Button basic onClick={this.handleAddUserClick}>
            Create New User
          </Button>
          <Divider clearing />
          <Modal
            centered
            size="lg"
            show={selectedUserId != null}
            onHide={this.close}
          >
            <Modal.Header closeButton bsPrefix="modal-header">
              <Modal.Title>
                {this.state.selectedUserId >= 0
                  ? "Edit User"
                  : "Create New User"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row fluid>
                <Col fluid>
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
                      <Dropdown
                        placeholder="Courses"
                        name="courses"
                        fluid
                        multiple
                        search
                        selection
                        allowAdditions
                        options={courseOptions}
                        value={selectedUser.courses}
                        onAddItem={this.handleDropdownAddition}
                        onChange={this.handleDropdownChange}
                      />
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
                    <Form.Field>
                      <label>Phone Number:</label>
                      <Form.Input
                        type="phone"
                        placeholder="Phone Number"
                        defaultValue={selectedUser.phone}
                        onChange={(e) => {
                          this.handleChange(e, "phone");
                        }}
                      ></Form.Input>
                    </Form.Field>
                  </Form>
                </Col>
                <Col fluid>
                  <Table>title={<h2>Users</h2>}</Table>
                </Col>
              </Row>
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

export default Users;

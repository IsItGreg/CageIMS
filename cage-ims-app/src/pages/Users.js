import React, { Component } from "react";
import { Divider, Button, Form, Dropdown, Tab } from "semantic-ui-react";
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
        {
          title: "Courses",
          field: "courses",
          render: (rowData) => {
            return rowData.courses.length > 0
              ? rowData.courses.reduce((result, item) => (
                  <>
                    {result}
                    {", "}
                    {item}
                  </>
                ))
              : "";
          },
        },
      ],
      open: false,

      firstNameError: false,
      lastNameError: false,
      idError: false,
      emailError: false,

      selectedUserId: null,
      selectedUser: {
        fname: "",
        lname: "",
        courses: [],
        id: "",
        email: "",
        phone: "",
      },
      courseOptions: [
        { text: "Photography I", value: "Photography I" },
        { text: "Photography II", value: "Photography II" },
        { text: "Documentary Image", value: "Documentary Image" },
      ],
    };
  }

  close = () =>
    this.setState({
      selectedUserId: null,
      firstNameError: false,
      lastNameError: false,
      idError: false,
      emailError: false,
    });

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
    this.setState({
      selectedUserId: -1,
      selectedUser: {
        fname: "",
        lname: "",
        courses: [],
        id: "",
        email: "",
        phone: "",
      },
    });
  };

  checkErrorUpdateDataSet = () => {
    if (
      !this.state.firstNameError &&
      !this.state.lastNameError &&
      !this.state.idError &&
      !this.state.emailError
    ) {
      this.setState((prevState) => {
        let dataSet = Array.from(prevState.dataSet);
        if (this.state.selectedUserId >= 0) {
          dataSet[this.state.selectedUserId] = this.state.selectedUser;
        } else {
          dataSet.push(this.state.selectedUser);
        }
        return { dataSet };
      }, this.close);
    }
  };

  handleSubmitClick = () => {
    this.setState(
      {
        firstNameError: this.state.selectedUser.fname === "",
        lastNameError: this.state.selectedUser.lname === "",
        idError: this.state.selectedUser.id === "",
        emailError: this.state.selectedUser.email === "",
      },
      this.checkErrorUpdateDataSet
    );
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
    const selectedUser = this.state.selectedUser;
    let table;
    if (this.state.selectedUserId != null) {
      if (this.state.selectedUserId >= 0) {
        const panes = [
          {
            menuItem: "Due Items",
            render: () => (
              <Table
                title={
                  this.state.selectedUser.fname +
                  " " +
                  this.state.selectedUser.lname
                }
              ></Table>
            ),
          },
          {
            menuItem: "Completed Transactions",
            render: () => (
              <Table
                title={
                  this.state.selectedUser.fname +
                  " " +
                  this.state.selectedUser.lname
                }
              ></Table>
            ),
          },
        ];
        table = (
          <Col>
            <Tab panes={panes} className="stretch-h flex-col" />
          </Col>
        );
      }
    }

    const courseOptions = this.state.courseOptions;
    return (
      <div className="page-content stretch-h">
        <Col className="stretch-h flex-col">
          <div className="topbar">
            <Button basic onClick={this.handleAddUserClick}>
              Create New User
            </Button>
            <Divider clearing />
          </div>
          <Table
            data={Array.from(this.state.dataSet)}
            columns={this.state.columnSet}
            title={<h2>Users</h2>}
            onRowClick={(event, rowData) =>
              this.handleUserSelectClick(event, rowData)
            }
          />
          <Modal
            centered
            size={this.state.selectedUserId >= 0 ? "xl" : "lg"}
            show={selectedUserId != null}
            onHide={this.close}
          >
            <Modal.Header closeButton bsPrefix="modal-header">
              <Modal.Title>User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col>
                  <Form>
                    <Form.Field>
                      <label>
                        First Name:
                        {this.state.firstNameError && (
                          <span className="error-text modal-label-error-text">
                            Error: Field cannot be empty.
                          </span>
                        )}
                      </label>
                      <Form.Input
                        error={this.state.firstNameError}
                        name="fname"
                        placeholder="First Name"
                        defaultValue={selectedUser.fname}
                        onChange={(e) => {
                          this.handleChange(e, "fname");
                        }}
                      ></Form.Input>
                    </Form.Field>
                    <Form.Field>
                      <label>
                        Last Name:
                        {this.state.lastNameError && (
                          <span className="error-text modal-label-error-text">
                            Error: Field cannot be empty.
                          </span>
                        )}
                      </label>
                      <Form.Input
                        error={this.state.lastNameError}
                        name="lname"
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
                      <label>
                        UML ID:
                        {this.state.idError && (
                          <span className="error-text modal-label-error-text">
                            Error: Field cannot be empty.
                          </span>
                        )}
                      </label>
                      <Form.Input
                        name="id"
                        error={this.state.idError}
                        placeholder="UML ID"
                        defaultValue={selectedUser.id}
                        onChange={(e) => {
                          this.handleChange(e, "id");
                        }}
                      ></Form.Input>
                    </Form.Field>
                    <Form.Field>
                      <label>
                        Email:
                        {this.state.emailError && (
                          <span className="error-text modal-label-error-text">
                            Error: Field cannot be empty.
                          </span>
                        )}
                      </label>
                      <Form.Input
                        name="email"
                        error={this.state.emailError}
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
                        name="phone"
                        placeholder="Phone Number"
                        defaultValue={selectedUser.phone}
                        onChange={(e) => {
                          this.handleChange(e, "phone");
                        }}
                      ></Form.Input>
                    </Form.Field>
                  </Form>
                </Col>
                {table}
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
        </Col>
      </div>
    );
  }
}

export default Users;

import React, { Component } from "react";
import { Divider, Button, Form, Dropdown } from "semantic-ui-react";
import { Col, Row, Modal } from "react-bootstrap";
import Table from "../common/Table";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";

class Staff extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      dataSet: [
        {
          fname: "Seamus",
          lname: "Rioux",
          courses: ["Photography I", "Photography II"],
          roles: ["Admin", "Staff"],
          id: "54321",
          email: "seamus.rioux3@gmail.com",
          phone: "123-456-7890",
        },
        {
          fname: "Greg",
          lname: "Smelkov",
          courses: ["Photography I"],
          roles: ["Admin"],
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
        {
          title: "Roles",
          field: "roles",
          render: (rowData) => {
            return rowData.roles.length > 0
              ? rowData.roles.reduce((result, item) => (
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
        roles: [],
        id: "",
        email: "",
        phone: "",
      },
      courseOptions: [
        { text: "Photography I", value: "Photography I" },
        { text: "Photography II", value: "Photography II" },
        { text: "Documentary Image", value: "Documentary Image" },
      ],
      roleOptions: [
        { text: "Admin", value: "Admin" },
        { text: "Staff", value: "Staff" },
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
        roles: [],
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

  handleDropdownAdditionRoles = (e, { value }) => {
    this.setState((prevState) => ({
      roleOptions: [{ text: value, value }, ...prevState.roleOptions],
    }));
  };

  handleDropdownAdditionCourses = (e, { value }) => {
    this.setState((prevState) => ({
      courseOptions: [{ text: value, value }, ...prevState.courseOptions],
    }));
  };

  handleDropdownChangeCourses = (e, { value }) => {
    const val = value;
    this.setState((prevState) => {
      let selectedUser = Object.assign({}, prevState.selectedUser);
      selectedUser.courses = val;
      return { selectedUser };
    });
  };

  handleDropdownChangeRoles = (e, { value }) => {
    const val = value;
    this.setState((prevState) => {
      let selectedUser = Object.assign({}, prevState.selectedUser);
      selectedUser.roles = val;
      return { selectedUser };
    });
  };

  render() {
    const selectedUserId = this.state.selectedUserId;
    const selectedUser = this.state.selectedUser;
    const courseOptions = this.state.courseOptions;
    const roleOptions = this.state.roleOptions;
    return (
      <Col className="stretch-h flex-col">
        <div className="top-bar">
          <Button basic onClick={this.handleAddUserClick}>
            Create New Staff
          </Button>
          <Divider clearing />
        </div>
        <div className="page-content stretch-h">
          <Col className="stretch-h flex-col">
            <Table
              data={Array.from(this.state.dataSet)}
              columns={this.state.columnSet}
              title={<h2>Staff</h2>}
              onRowClick={(event, rowData) =>
                this.handleUserSelectClick(event, rowData)
              }
            />
            <Modal
              centered
              size={"lg"}
              show={selectedUserId != null}
              onHide={this.close}
            >
              <Modal.Header bsPrefix="modal-header">
                <Modal.Title>Staff</Modal.Title>
                <IconButton onClick={this.close} size="small" color="inherit">
                  <ClearIcon />
                </IconButton>
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
                          onAddItem={this.handleDropdownAdditionCourses}
                          onChange={this.handleDropdownChangeCourses}
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>Roles:</label>
                        <Dropdown
                          placeholder="Roles"
                          name="roles"
                          fluid
                          multiple
                          search
                          selection
                          allowAdditions
                          options={roleOptions}
                          value={selectedUser.roles}
                          onAddItem={this.handleDropdownAdditionRoles}
                          onChange={this.handleDropdownChangeRoles}
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
      </Col>
    );
  }
}

export default Staff;

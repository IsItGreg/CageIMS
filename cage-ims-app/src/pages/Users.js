import React, { Component } from "react";
import { Divider, Button, Form, Dropdown, Tab, Icon } from "semantic-ui-react";
import { Col, Row, Modal } from "react-bootstrap";
import Table from "../common/Table";

class Users extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
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
      editable: true,
      isChangesMadeToModal: false,

      selectedUserId: null,
      selectedUser: {
        fname: "",
        lname: "",
        courses: [],
        uid: "",
        email: "",
        phone: "",
        notes: "",
        transactions: [],
        creationDate: "",
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
      editable: true,
      submitName: "Close",
      submitIcon: null,
      isChangesMadeToModal: false,
    });

  handleChange = (e, userProp) => {
    const val = e.target.value;
    this.setState((prevState) => {
      let selectedUser = Object.assign({}, prevState.selectedUser);
      selectedUser[userProp] = val;
      return { selectedUser };
    });
    this.setState({
      isChangesMadeToModal: true,
    });
  };

  handleUserEditClick = () => {
    this.setState({
      editable: !this.state.editable,
    });
  };

  handleUserSelectClick = (e, rowData) => {
    this.setState({
      selectedUserId: rowData.tableData.id,
      selectedUser: this.props.data.users[rowData.tableData.id],
    });
    this.setState((prevState) => {
      let selectedUser = Object.assign({}, prevState.selectedUser);
      let transactions = Array.from(
        this.props.data.transactions.filter(
          (name) => name.uid === selectedUser.uid
        )
      );
      transactions.forEach((transaction) => {
        transaction.backgroundColor =
          !transaction.checkedInDate &&
          new Date(transaction.dueDate).getTime() < new Date().getTime()
            ? "mistyrose"
            : "";
      });
      selectedUser["transactions"] = transactions;
      return { selectedUser };
    });
  };

  handleAddUserClick = () => {
    this.setState({
      selectedUserId: -1,
      selectedUser: {
        fname: "",
        lname: "",
        courses: [],
        uid: "",
        email: "",
        phone: "",
        notes: "",
        creationDate: "",
        tranactions: [],
      },
      editable: false,
    });
  };

  checkErrorUpdateDataSet = () => {
    if (
      !this.state.firstNameError &&
      !this.state.lastNameError &&
      !this.state.idError &&
      !this.state.emailError
    ) {
      let data = Object.assign({}, this.props.data);
      if (this.state.selectedUserId >= 0) {
        data.users[this.state.selectedUserId] = this.state.selectedUser;
      } else {
        this.state.selectedUser.creationDate = new Date().getTime();
        data.users.push(this.state.selectedUser);
      }
      this.props.onUpdateData(data);
      this.close();
    }
  };

  handleSubmitClick = () => {
    this.setState(
      {
        firstNameError: this.state.selectedUser.fname === "",
        lastNameError: this.state.selectedUser.lname === "",
        idError: this.state.selectedUser.uid === "",
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

  formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return (
      date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear()
    );
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
                columns={[
                  { title: "Item ID", field: "iid" },
                  { title: "Transaction ID", field: "tid" },
                  {
                    title: "Checked Out Date",
                    field: "checkedOutDate",
                    render: (rowData) =>
                      this.formatDate(rowData.checkedOutDate),
                  },
                  {
                    title: "Due Date",
                    field: "dueDate",
                    render: (rowData) => this.formatDate(rowData.dueDate),
                  },
                ]}
                data={Array.from(
                  this.state.selectedUser.transactions.filter(
                    (name) => name.checkedInDate === ""
                  )
                )}
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
                columns={[
                  { title: "Item ID", field: "iid" },
                  { title: "Transaction ID", field: "tid" },
                  {
                    title: "Checked Out Date",
                    field: "checkedOutDate",
                    render: (rowData) =>
                      this.formatDate(rowData.checkedOutDate),
                  },
                  {
                    title: "Checked In Date",
                    field: "checkedInDate",
                    render: (rowData) => this.formatDate(rowData.checkedInDate),
                  },
                ]}
                data={Array.from(
                  this.state.selectedUser.transactions.filter(
                    (name) => !(name.checkedInDate === "")
                  )
                )}
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
      <Col className="stretch-h flex-col">
        <div className="top-bar">
          <Button basic onClick={this.handleAddUserClick}>
            Create New User
          </Button>
          <Divider clearing />
        </div>
        <div className="page-content stretch-h">
          <Col className="stretch-h flex-col">
            <Table
              data={Array.from(this.props.data.users)}
              columns={this.state.columnSet}
              title={<h2>Users</h2>}
              onRowClick={(event, rowData) =>
                this.handleUserSelectClick(event, rowData)
              }
            />
            <Modal
              centered
              size={selectedUserId >= 0 ? "xl" : "lg"}
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
                          readOnly={this.state.editable}
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
                          readOnly={this.state.editable}
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
                          disabled={this.state.editable}
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
                          defaultValue={selectedUser.uid}
                          onChange={(e) => {
                            this.handleChange(e, "uid");
                          }}
                          readOnly={this.state.editable}
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
                          readOnly={this.state.editable}
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
                          readOnly={this.state.editable}
                        ></Form.Input>
                      </Form.Field>
                      <Form.Field>
                        <label>Notes:</label>
                        <Form.Input
                          name="notes"
                          placeholder="Notes"
                          defaultValue={selectedUser.notes}
                          onChange={(e) => {
                            this.handleChange(e, "notes");
                          }}
                          readOnly={this.state.editable}
                        ></Form.Input>
                      </Form.Field>
                      {selectedUserId >= 0 ? (
                        <Form.Field>
                          <label>Date Created:</label>
                          <Form.Input
                            name="creationDate"
                            placeholder="creationDate"
                            defaultValue={this.formatDate(
                              selectedUser.creationDate
                            )}
                            readOnly
                          ></Form.Input>
                        </Form.Field>
                      ) : null}
                    </Form>
                  </Col>
                  {table}
                </Row>
              </Modal.Body>
              <Modal.Footer>
                {this.state.selectedUserId >= 0 ? (
                  <Button
                    className="btn btn-primary mr-auto"
                    toggle
                    active={!this.state.editable}
                    onClick={this.handleUserEditClick}
                  >
                    <Icon name="pencil" />
                    Edit
                  </Button>
                ) : null}
                <Button
                  id="add-icon-handler"
                  variant="primary"
                  onClick={this.handleSubmitClick}
                >
                  {this.state.isChangesMadeToModal ? (
                    <Icon name="save"></Icon>
                  ) : null}
                  {this.state.isChangesMadeToModal ? "Save" : "Close"}
                </Button>
              </Modal.Footer>
            </Modal>
          </Col>
        </div>
      </Col>
    );
  }
}

export default Users;

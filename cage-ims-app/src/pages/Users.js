import React, { Component } from "react";
import {
  Divider,
  Button,
  Form,
  Dropdown,
  Tab,
  Icon,
  Menu,
} from "semantic-ui-react";
import { Col, Row, Modal } from "react-bootstrap";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";
import Table from "../common/Table";

class Users extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    const headerStyleGrey = {
      backgroundColor: "#E2E2E2",
      color: "black",
      fontSize: "24",
    };
    this.state = {
      columnSet: [
        {
          title: "Last Name",
          field: "lname",
          defaultSort: "asc",
          headerStyle: headerStyleGrey,
        },
        { title: "First Name", field: "fname", headerStyle: headerStyleGrey },
        {
          title: "Courses",
          field: "courses",
          headerStyle: headerStyleGrey,
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

      activeItem: "user",
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
      return { selectedUser, isChangesMadeToModal: true };
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
        creationDate: new Date().getTime(),
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
        data.users.push(this.state.selectedUser);
      }
      this.props.onUpdateData(data);
      this.close();
    }
  };

  handleSubmitClick = () => {
    if (this.state.isChangesMadeToModal) {
      this.setState(
        {
          firstNameError: this.state.selectedUser.fname === "",
          lastNameError: this.state.selectedUser.lname === "",
          idError: this.state.selectedUser.uid === "",
          emailError: this.state.selectedUser.email === "",
        },
        this.checkErrorUpdateDataSet
      );
    } else {
      this.close();
    }
  };

  handleDropdownChange = (e, { value }) => {
    const val = value;
    this.setState((prevState) => {
      let selectedUser = Object.assign({}, prevState.selectedUser);
      selectedUser.courses = val;
      return { selectedUser, isChangesMadeToModal: true };
    });
  };

  formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return (
      date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear()
    );
  };

  formatUserDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    let hours = date.getHours();
    let daynnite = "";
    if (hours > 12) {
      hours = hours - 12;
      daynnite = "PM";
    } else if (hours === 0) {
      hours = 12;
      daynnite = "AM";
    } else if (hours < 12) {
      daynnite = "AM";
    }
    return (
      date.getMonth() +
      1 +
      "/" +
      date.getDate() +
      "/" +
      date.getFullYear() +
      " " +
      hours +
      ":" +
      (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
      ":" +
      (date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds()) +
      " " +
      daynnite
    );
  };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const selectedUserId = this.state.selectedUserId;
    const selectedUser = this.state.selectedUser;
    let formTablePanes = [];
    if (this.state.selectedUserId != null && this.state.selectedUserId >= 0) {
      formTablePanes = [
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
                  render: (rowData) => this.formatDate(rowData.checkedOutDate),
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
                  render: (rowData) => this.formatDate(rowData.checkedOutDate),
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
    }

    const courseOptions = Array.from(
      new Set(
        [].concat.apply(
          [],
          [
            this.state.selectedUser,
            ...this.props.data.items,
            ...this.props.data.users,
          ]
            .filter((item) => item.courses)
            .map((item) => item.courses)
        )
      )
    )
      .sort()
      .map((item) => ({ text: item, value: item }));

    return (
      <Col className="stretch-h flex-col">
        <div className="top-bar">
          <Button
            style={{ backgroundColor: "#46C88C", color: "white" }}
            onClick={this.handleAddUserClick}
          >
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
              dialogClassName="modal-30w"
              show={selectedUserId != null}
              onHide={this.close}
            >
              <Modal.Header bsPrefix="modal-header">
                <Modal.Title>User</Modal.Title>
                <IconButton onClick={this.close} size="small" color="inherit">
                  <ClearIcon />
                </IconButton>
              </Modal.Header>
              <Modal.Body>
                {this.state.activeItem == "user" &&
                  this.state.selectedUser !== null && (
                    <Form>
                      <Form.Group widths={2}>
                        <Form.Field>
                          <label>
                            First Name:
                            {this.state.firstNameError && (
                              <span className="error-text modal-label-error-text">
                                Error: Field is empty.
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
                                Error: Field is empty.
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
                      </Form.Group>
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
                          onChange={this.handleDropdownChange}
                          disabled={this.state.editable}
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>
                          UML ID:
                          {this.state.idError && (
                            <span className="error-text modal-label-error-text">
                              Error: Field is empty.
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
                      <Form.Group widths={2}>
                        <Form.Field>
                          <label>
                            Email:
                            {this.state.emailError && (
                              <span className="error-text modal-label-error-text">
                                Error: Field is empty.
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
                      </Form.Group>
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
                            defaultValue={this.formatUserDate(
                              selectedUser.creationDate
                            )}
                            readOnly
                          ></Form.Input>
                        </Form.Field>
                      ) : null}
                    </Form>
                  )}
                {this.state.activeItem === "table" &&
                  this.state.selectedUserId >= 0 && (
                    <Tab
                      panes={formTablePanes}
                      className="stretch-h flex-col"
                    />
                  )}
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
                {this.state.selectedUserId >= 0 && (
                  <Menu compact className="mr-auto">
                    <Menu.Item
                      name="user"
                      active={this.state.activeItem === "user"}
                      onClick={this.handleItemClick}
                    >
                      <Icon name="clipboard list" />
                      User Form
                    </Menu.Item>
                    <Menu.Item
                      name="table"
                      active={this.state.activeItem === "table"}
                      onClick={this.handleItemClick}
                    >
                      <Icon name="book" />
                      Transactions
                    </Menu.Item>
                  </Menu>
                )}
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

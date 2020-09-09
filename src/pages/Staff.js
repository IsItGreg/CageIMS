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
import TextField from "@material-ui/core/TextField";
import XLSX from "xlsx";
import Table from "../common/Table";

class Users extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleImportSpreadsheetClick = this.handleImportSpreadsheetClick.bind(
      this
    );
    this.state = {
      activeItem: "user",
      firstNameError: false,
      lastNameError: false,
      idError: false,
      emailError: false,
      editable: true,
      isChangesMadeToModal: false,

      showImportExcelModal: false,
      importedExcelData: [],
      importEmailErrors: {},

      selectedStaffId: null,
      selectedStaff: {
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
      selectedStaffId: null,
      selectedStaff: {
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
      let selectedStaff = Object.assign({}, prevState.selectedStaff);
      selectedStaff[userProp] = val;
      return { selectedStaff, isChangesMadeToModal: true };
    });
  };

  handleUserEditClick = () => {
    !this.state.isChangesMadeToModal &&
      this.setState({
        editable: !this.state.editable,
      });
  };

  handleUserSelectClick = (e, rowData) => {
    this.setState({
      selectedStaffId: rowData.tableData.id,
      selectedStaff: this.props.data.staff[rowData.tableData.id],
    });
    this.setState((prevState) => {
      let selectedStaff = Object.assign({}, prevState.selectedStaff);
      let transactions = Array.from(
        this.props.data.transactions.filter(
          (name) => name.uid === selectedStaff.uid
        )
      );
      transactions.forEach((transaction) => {
        transaction.backgroundColor =
          !transaction.checkedInDate &&
          new Date(transaction.dueDate).getTime() < new Date().getTime()
            ? "mistyrose"
            : "";
      });
      selectedStaff["transactions"] = transactions;
      return { selectedStaff };
    });
  };

  handleAddUserClick = () => {
    this.setState({
      selectedStaffId: -1,
      selectedStaff: {
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

  handleImportSpreadsheetClick = () => {
    this.refs.fileUploader.click();
  };

  handleClearAllCoursesClick = () => {
    if (
      window.confirm(
        "Are you sure you want to clear every user's courses? This process is irreversible."
      )
    ) {
      let data = Object.assign({}, this.props.data);
      data.users.forEach((user) => (user.courses = []));
      this.props.onUpdateData(data);
    }
  };

  checkErrorUpdateDataSet = () => {
    if (
      !this.state.firstNameError &&
      !this.state.lastNameError &&
      !this.state.idError &&
      !this.state.emailError
    ) {
      let data = Object.assign({}, this.props.data);
      if (this.state.selectedStaffId >= 0) {
        data.users[this.state.selectedStaffId] = this.state.selectedStaff;
      } else {
        data.users.push(this.state.selectedStaff);
      }
      this.props.onUpdateData(data);
      this.close();
    }
  };

  handleSubmitClick = () => {
    if (this.state.isChangesMadeToModal) {
      this.setState(
        {
          firstNameError: this.state.selectedStaff.fname === "",
          lastNameError: this.state.selectedStaff.lname === "",
          idError: this.state.selectedStaff.uid === "",
          emailError: this.state.selectedStaff.email === "",
        },
        this.checkErrorUpdateDataSet
      );
    } else {
      this.close();
    }
  };

  handleSaveImportStudents = () => {
    if (!this.state.isChangesMadeToModal) {
      this.close();
    }

    if (
      this.state.importedExcelData.every(
        (user) => this.state["importEmailValid" + user.uid]
      )
    ) {
      let newUsers = Array.from(this.state.importedExcelData);
      newUsers.forEach(
        (user) =>
          (user.courses = user.courses.concat(this.state.selectedStaff.courses))
      );
      let users = [
        ...newUsers,
        ...this.props.data.staff.filter(
          (user) =>
            this.state.importedExcelData.find(
              (nuser) => nuser.uid === user.uid
            ) === undefined
        ),
      ];

      let data = Object.assign({}, this.props.data);
      data.users = users;
      this.props.onUpdateData(data);
      this.close();
    }
  };

  handleDropdownChange = (e, { value }) => {
    const val = value;
    this.setState((prevState) => {
      let selectedStaff = Object.assign({}, prevState.selectedStaff);
      selectedStaff.courses = val;
      return { selectedStaff, isChangesMadeToModal: true };
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
    const date = new Date(dateString)
      .toLocaleString(
        [],
        ("en-US",
        {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
      )
      .split(",")
      .join(" ");
    return date;
  };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const headerStyleGrey = {
      backgroundColor: "#E2E2E2",
      color: "black",
      fontSize: "24",
    };
    const columnSet = [
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
    ];
    const selectedStaffId = this.state.selectedStaffId;
    const selectedStaff = this.state.selectedStaff;
    let formTablePanes = [];
    if (this.state.selectedStaffId != null && this.state.selectedStaffId >= 0) {
      formTablePanes = [
        {
          menuItem: "Due Items",
          render: () => (
            <Table
              title={
                this.state.selectedStaff.fname +
                " " +
                this.state.selectedStaff.lname
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
                this.state.selectedStaff.transactions.filter(
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
                this.state.selectedStaff.fname +
                " " +
                this.state.selectedStaff.lname
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
                this.state.selectedStaff.transactions.filter(
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
            this.state.selectedStaff,
            ...this.props.data.items,
            ...this.props.data.staff,
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
          <Row>
            <Col>
              <Button
                className="float-down"
                size="medium"
                style={{ backgroundColor: "#46C88C", color: "white" }}
                onClick={this.handleAddUserClick}
              >
                Create New Staff
              </Button>
            </Col>
            <Col>
              <h1>Staff List</h1>
            </Col>
            <Col>
              <div className="float-down right-buttons">
                <Button
                  color="red"
                  basic
                  size="medium"
                  onClick={this.handleClearAllCoursesClick}
                >
                  Clear All Courses
                </Button>
              </div>
            </Col>
          </Row>
          <Divider clearing />
        </div>
        <div className="page-content stretch-h">
          <Col className="stretch-h flex-col">
            <Table
              data={Array.from(this.props.data.staff)}
              columns={columnSet}
              title={<h2>Staff</h2>}
              onRowClick={(event, rowData) =>
                this.handleUserSelectClick(event, rowData)
              }
            />
            <Modal centered show={selectedStaffId != null} onHide={this.close}>
              <Modal.Header bsPrefix="modal-header">
                <Modal.Title>User</Modal.Title>
                <IconButton onClick={this.close} size="small" color="inherit">
                  <ClearIcon />
                </IconButton>
              </Modal.Header>
              <Modal.Body>
                {this.state.activeItem === "user" &&
                  this.state.selectedStaff !== null && (
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
                            defaultValue={selectedStaff.fname}
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
                            defaultValue={selectedStaff.lname}
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
                          value={selectedStaff.courses}
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
                          defaultValue={selectedStaff.sid}
                          onChange={(e) => {
                            this.handleChange(e, "sid");
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
                            defaultValue={selectedStaff.email}
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
                            defaultValue={selectedStaff.phone}
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
                          defaultValue={selectedStaff.notes}
                          onChange={(e) => {
                            this.handleChange(e, "notes");
                          }}
                          readOnly={this.state.editable}
                        ></Form.Input>
                      </Form.Field>
                      {selectedStaffId >= 0 ? (
                        <Form.Field>
                          <label>Date Created:</label>
                          <Form.Input
                            name="creationDate"
                            placeholder="creationDate"
                            defaultValue={this.formatUserDate(
                              selectedStaff.creationDate
                            )}
                            readOnly
                          ></Form.Input>
                        </Form.Field>
                      ) : null}
                    </Form>
                  )}
                {this.state.activeItem === "table" &&
                  this.state.selectedStaffId >= 0 && (
                    <Tab
                      panes={formTablePanes}
                      className="stretch-h flex-col"
                    />
                  )}
              </Modal.Body>
              <Modal.Footer>
                {this.state.selectedStaffId >= 0 ? (
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
                {this.state.selectedStaffId >= 0 && (
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

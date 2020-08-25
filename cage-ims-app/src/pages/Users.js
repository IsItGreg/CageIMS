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
    const headerStyleGrey = {
      backgroundColor: "#E2E2E2",
      color: "black",
      fontSize: "24",
    };
    this.handleImportSpreadsheetClick = this.handleImportSpreadsheetClick.bind(
      this
    );
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

      showImportExcelModal: false,
      importedExcelData: [],
      importEmailErrors: {},

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
      firstNameError: false,
      lastNameError: false,
      idError: false,
      emailError: false,
      editable: true,
      submitName: "Close",
      submitIcon: null,
      isChangesMadeToModal: false,
      showImportExcelModal: false,
      importedExcelData: [],
      importEmailErrors: {},
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
    !this.state.isChangesMadeToModal &&
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

  onChangeFile(event) {
    const fileObj = event.target.files[0];
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;

    reader.onload = (e) => {
      const wb = XLSX.read(e.target.result, {
        type: rABS ? "binary" : "array",
        bookVBA: true,
      });
      const data = XLSX.utils
        .sheet_to_json(wb.Sheets[wb.SheetNames[0]])
        .map((user) => ({
          fname: user["Preferred Name"].split(/[\s, ]+/)[1],
          lname: user["Preferred Name"].split(/[\s, ]+/)[0],
          courses: [],
          uid:
            "0".repeat(8 - user["ID"].toString().length) +
            user["ID"].toString(),
          email:
            user["Preferred Name"].split(/[\s, ]+/)[1] +
            "_" +
            user["Preferred Name"].split(/[\s, ]+/)[0],
          creationDate: new Date().getTime(),
        }))
        .map((nuser) => {
          const existingUser = this.props.data.users.find(
            (user) => user.uid === nuser.uid
          );
          if (existingUser === undefined) return nuser;
          this.setState({
            ["importEmailValid" +
            existingUser.uid]: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
              existingUser.email
            ),
          });
          return existingUser;
        });

      //TODO: check ids aren't duplicate

      this.setState({ importedExcelData: data, showImportExcelModal: true });
    };

    if (rABS) {
      reader.readAsBinaryString(fileObj);
    } else {
      reader.readAsArrayBuffer(fileObj);
    }
  }

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
          (user.courses = user.courses.concat(this.state.selectedUser.courses))
      );
      let users = [
        ...newUsers,
        ...this.props.data.users.filter(
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

  updateImportEmail = (e, uid) => {
    const val = e.target.value;
    this.setState((prevState) => {
      let importedExcelData = Array.from(prevState.importedExcelData);
      importedExcelData.find((user) => user.uid === uid).email = val;
      return {
        ["importEmailValid" +
        uid]: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(val),
        isChangesMadeToModal: true,
        importedExcelData,
      };
    });
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

    const importColumns = [
      { title: "Last Name", field: "lname", defaultSort: "asc" },
      { title: "First Name", field: "fname" },
      { title: "Student ID", field: "uid" },
      {
        title: "Email",
        field: "email",
        render: (rowData) => (
          <TextField
            defaultValue={rowData.email}
            error={!this.state["importEmailValid" + rowData.uid]}
            helperText={
              !this.state["importEmailValid" + rowData.uid]
                ? "Enter a valid email."
                : ""
            }
            onChange={(e) => {
              this.updateImportEmail(e, rowData.uid);
            }}
          />
        ),
      },
    ];

    return (
      <Col className="stretch-h flex-col">
        <div className="top-bar">
          <Button
            style={{ backgroundColor: "#46C88C", color: "white" }}
            onClick={this.handleAddUserClick}
          >
            Create New User
          </Button>
          <Button basic onClick={this.handleImportSpreadsheetClick}>
            Import from Excel
          </Button>
          <input
            type="file"
            ref="fileUploader"
            style={{ display: "none" }}
            onChange={this.onChangeFile.bind(this)}
          />
          <Button basic onClick={this.handleClearAllCoursesClick}>
            Clear All Courses
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
              size={"xl"}
              show={this.state.showImportExcelModal}
              onHide={this.close}
            >
              <Modal.Header closeButton bsPrefix="modal-header">
                <Modal.Title>Import from Excel file</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Row>
                  <Col>
                    <Table
                      data={this.state.importedExcelData}
                      columns={importColumns}
                    />
                    <Form>
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
                        />
                      </Form.Field>
                    </Form>
                  </Col>
                </Row>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  id="add-icon-handler"
                  variant="primary"
                  onClick={this.handleSaveImportStudents}
                >
                  {this.state.isChangesMadeToModal ? (
                    <Icon name="save"></Icon>
                  ) : null}
                  {this.state.isChangesMadeToModal ? "Save" : "Cancel"}
                </Button>
              </Modal.Footer>
            </Modal>
            <Modal centered show={selectedUserId != null} onHide={this.close}>
              <Modal.Header bsPrefix="modal-header">
                <Modal.Title>User</Modal.Title>
                <IconButton onClick={this.close} size="small" color="inherit">
                  <ClearIcon />
                </IconButton>
              </Modal.Header>
              <Modal.Body>
                {this.state.activeItem === "user" &&
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

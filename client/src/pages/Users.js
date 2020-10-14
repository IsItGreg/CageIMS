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
import * as FileSaver from 'file-saver';

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getUsersIfNeeded, putUser, postUser } from "../actions/userActions"
import { getItemsIfNeeded} from "../actions/itemActions"

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
      exportModalDropdownSelection: "",

      showImportExcelModal: false,
      showExportExcelModal: false,
      importedExcelData: [],
      importEmailErrors: {},

      selectedUserId: null,
      selectedUser: {
        fname: "",
        lname: "",
        courses: [],
        userCode: "",
        email: "",
        phone: "",
        notes: "",
        transactions: [],
        creationDate: "",
      },
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getUsersIfNeeded());
    dispatch(getItemsIfNeeded());
  }

  close = () => {
    this.setState({
      selectedUserId: null,
      selectedUser: {
        fname: "",
        lname: "",
        courses: [],
        userCode: "",
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
      showExportExcelModal: false,
      showImportExcelModal: false,
      importedExcelData: [],
      importEmailErrors: {},
    });
    const { dispatch } = this.props;
    dispatch(getUsersIfNeeded());
  }

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
    console.log(rowData);
    this.setState({
      selectedUserId: rowData.tableData.id,
      selectedUser: rowData,
    });
    // this.setState((prevState) => {
    //   let selectedUser = Object.assign({}, prevState.selectedUser);
    //   let transactions = Array.from(
    //     this.props.data.transactions.filter(
    //       (name) => name.uid === selectedUser.uid
    //     )
    //   );
    //   transactions.forEach((transaction) => {
    //     transaction.backgroundColor =
    //       !transaction.checkedInDate &&
    //       new Date(transaction.dueDate).getTime() < new Date().getTime()
    //         ? "mistyrose"
    //         : "";
    //   });
    //   selectedUser["transactions"] = transactions;
    //   return { selectedUser };
    // });
  };

  handleAddUserClick = () => {
    this.setState({
      selectedUserId: -1,
      selectedUser: {
        fname: "",
        lname: "",
        courses: [],
        userCode: "",
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
    const { dispatch } = this.props;
    if (
      window.confirm(
        "Are you sure you want to clear every user's courses? This process is irreversible."
      )
    ) {
      this.props.users.forEach(user => {
        user.courses = [];
        dispatch(putUser(user));
      })
    }
    dispatch(getUsersIfNeeded());
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
      let usedUserCodes = [];
      const data = XLSX.utils
        .sheet_to_json(wb.Sheets[wb.SheetNames[0]])
        .map((user) => {
          let userCode = this.generateNewUserCode(usedUserCodes);
          usedUserCodes.push(parseInt(userCode));
          return {
            fname: user["Preferred Name"].split(/[\s, ]+/)[1],
            lname: user["Preferred Name"].split(/[\s, ]+/)[0],
            courses: [],
            userCode: userCode,
            email:
              user["Preferred Name"].split(/[\s, ]+/)[1] +
              "_" +
              user["Preferred Name"].split(/[\s, ]+/)[0],
          }
        })
        .map((nuser) => {
          const existingUser = this.props.users.find(
            (user) => user.email === nuser.email
          );
          if (existingUser === undefined) return nuser;
          this.setState({
            ["importEmailValid" +
              existingUser.userCode]: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
                existingUser.email
              ),
          });
          return existingUser;
        });

      console.log(data);
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

      const { dispatch } = this.props;
      if (this.state.selectedUserId < 0) {
        dispatch(postUser(this.state.selectedUser));
      }
      else {
        dispatch(putUser(this.state.selectedUser));
      }

      this.close();
    }
  };

  handleSubmitClick = () => {
    if (this.state.isChangesMadeToModal) {
      this.setState(
        {
          firstNameError: this.state.selectedUser.fname === "",
          lastNameError: this.state.selectedUser.lname === "",
          idError: this.state.selectedUser.userCode === "",
          emailError: this.state.selectedUser.email === "",
        },
        this.checkErrorUpdateDataSet
      );
    } else {
      this.close();
    }
  };

  handleSaveImportStudents = () => {
    const { dispatch } = this.props;
    if (!this.state.isChangesMadeToModal) {
      this.close();
    }

    if (
      this.state.importedExcelData.every(
        (user) => this.state["importEmailValid" + user.userCode]
      )
    ) {
      let newUsers = Array.from(this.state.importedExcelData);

      newUsers.forEach(
        (user) => {
          let exists = this.props.users.find(u => u.email === user.email);
          console.log(user);
          console.log(exists);
          if (!exists) {
            user.courses = user.courses.concat(this.state.selectedUser.courses);
            dispatch(postUser(user));
          } else {
            exists.courses = exists.courses.concat(this.state.selectedUser.courses)
            dispatch(putUser({ ...user, ...exists }));
          }
        }
      )

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

  updateImportEmail = (e, userCode) => {
    // TODO: Fix this
    const val = e.target.value;
    this.setState((prevState) => {
      let importedExcelData = Array.from(prevState.importedExcelData);
      importedExcelData.find((user) => user.userCode === userCode).email = val;
      return {
        ["importEmailValid" +
          userCode]: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(val),
        isChangesMadeToModal: true,
        importedExcelData,
      };
    });
  };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  generateNewUserCode = (avoidedCodes = []) => {
    let idArray = [...Array.from(this.props.users.map(user => parseInt(user.userCode))), ...avoidedCodes];
    let val = "";
    do {
      val = Math.floor(0 + Math.random() * 9).toString() + Math.floor(0 + Math.random() * 9).toString() + Math.floor(0 + Math.random() * 9).toString() + Math.floor(0 + Math.random() * 9).toString();
    } while (idArray.includes(val));
    return val;
  }

  regenerateUserCode = () => {
    this.setState((prevState) => {
      let selectedUser = Object.assign({}, prevState.selectedUser);
      selectedUser.userCode = this.generateNewUserCode();
      return { selectedUser, isChangesMadeToModel: true };
    })
  }

  handleExportSpreadsheetClick = () => {
    this.setState({ showExportExcelModal: true, })
  }

  handleDropdownChangeForExportFile = (e, { value }) => {
    this.setState({ exportModalDropdownSelection: value });
  }

  handleExportFile = () => {
    let arr = []
    console.log(this.state.exportModalDropdownSelection);

    arr = this.props.users.map(a => {
      let newObject = {};
      newObject["Name"] = a.lname + ", " + a.fname;
      newObject["ID Code"] = a.userCode;
      return newObject;
    });

    const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
    const fileExtension = '.xlsx';
    const ws = XLSX.utils.json_to_sheet(arr);
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] };
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, "StudenList" + fileExtension);
  }


  render() {
    const { users } = this.props;
    const selectedUserId = this.state.selectedUserId;
    const selectedUser = this.state.selectedUser;
    let formTablePanes = [];
    const headerStyleGrey = {
      backgroundColor: "#E2E2E2",
      color: "black",
      fontSize: "24",
    };

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
            />
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
            />
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
            ...this.props.items,
            ...this.props.users,
          ]
            .filter((item) => item.courses)
            .map((item) => item.courses)
        )
      )
    )
      .sort()
      .map((item) => ({ text: item, value: item }));

    const courseOptionsExport = [{ text: "All", value: "All" }, ...Array.from(courseOptions)];

    const importColumns = [
      { title: "Last Name", field: "lname", defaultSort: "asc" },
      { title: "First Name", field: "fname" },
      { title: "User Code", field: "userCode" },
      {
        title: "Email",
        field: "email",
        render: (rowData) => (
          <TextField
            defaultValue={rowData.email}
            error={!this.state["importEmailValid" + rowData.userCode]}
            helperText={
              !this.state["importEmailValid" + rowData.userCode]
                ? "Enter a valid email."
                : ""
            }
            onChange={(e) => {
              this.updateImportEmail(e, rowData.userCode);
            }}
          />
        ),
      },
    ];
    const columnSet = [
      {
        title: "Last Name",
        field: "lname",
        defaultSort: "asc",
        headerStyle: headerStyleGrey,
        filtering: false,
      },
      { title: "First Name", field: "fname", headerStyle: headerStyleGrey, filtering: false },
      {
        title: "Courses",
        field: "courses",
        headerStyle: headerStyleGrey,
        filterComponent: (props) => <Dropdown
          placeholder="Filter Courses"
          name="courses"
          fluid
          selection
          options={courseOptionsExport}
          onChange={(e, { value }) => {
            if (value != "All") {
              props.onFilterChanged(props.columnDef.tableData.id, value);
              console.log(props)
              console.log(value);
            } else {
              props.onFilterChanged(props.columnDef.tableData.id);
            }
          }}
        />,
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

    return (
      <Col className="stretch-h flex-col">
        <div className="top-bar">
          <Row>
            <Button
              className="float-down"
              size="small"
              floated="left"
              style={{ backgroundColor: "#46C88C", color: "white" }}
              onClick={this.handleAddUserClick}
            >
              Create New User
              </Button>
            <Col>
              <h1>User List</h1>
            </Col>
            <Col>
              <div className="float-down right-buttons">
                <Button
                  basic
                  floated="right"
                  size="tiny"
                  color="orange"
                  onClick={this.handleImportSpreadsheetClick}
                >
                  Import from Excel
                </Button>
                <Button
                  basic
                  floated="right"
                  size="tiny"
                  onClick={this.handleExportSpreadsheetClick}
                >
                  Export User List
                </Button>
                <input
                  type="file"
                  ref="fileUploader"
                  style={{ display: "none" }}
                  onChange={this.onChangeFile.bind(this)}
                />
                <Button
                  basic
                  floated="right"
                  color="red"
                  size="tiny"
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
              data={Array.from(users)}
              columns={columnSet}
              title={<h2>Users</h2>}
              options={{
                filtering: true,
              }}
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
                    <Icon name="save" />
                  ) : null}
                  {this.state.isChangesMadeToModal ? "Save" : "Cancel"}
                </Button>
              </Modal.Footer>
            </Modal>
            <Modal
              centered
              show={this.state.showExportExcelModal}
              onHide={this.close}
            >
              <Modal.Header bsPrefix="modal-header">
                <Modal.Title>Export Users List to Excel file</Modal.Title>
                <IconButton onClick={this.close} size="small" color="inherit">
                  <ClearIcon />
                </IconButton>
              </Modal.Header>
              <Modal.Body>
                <p>Would you like to export an excel spreadsheet of the users?</p>
                <Form>
                  <Form.Field>
                    <label>Select Course:</label>
                    <Dropdown
                      placeholder="Courses"
                      name="courses"
                      fluid
                      search
                      selection
                      options={courseOptionsExport}
                      value={this.state.exportModalDropdownSelection}
                      onChange={this.handleDropdownChangeForExportFile}
                    />
                  </Form.Field>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button
                  id="add-icon-handler"
                  variant="primary"
                  onClick={this.handleExportFile}
                >
                  <Icon name="save"></Icon>
                Save
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
                            name="firstName"
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
                            name="name.last"
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
                      <Form.Group unstackable widths={"2"}>
                        <Form.Field>
                          <label>
                            User Code:
                          {this.state.idError && (
                              <span className="error-text modal-label-error-text">
                                Error: Field is empty.
                              </span>
                            )}
                          </label>
                          <Form.Input
                            name="userCode"
                            error={this.state.idError}
                            placeholder="User Code"
                            value={this.state.selectedUser.userCode}
                            readOnly
                          ></Form.Input>
                        </Form.Field>
                        <Form.Field>
                          <label>
                            &nbsp;
                        </label>
                          <Form.Button color='blue' disabled={this.state.editable} onClick={this.regenerateUserCode}>Genrate New User ID</Form.Button>
                        </Form.Field>
                      </Form.Group>
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
                  {this.state.isChangesMadeToModal ? this.state.selectedUserId < 0 ? "Create" : "Save" : "Close"}
                </Button>
              </Modal.Footer>
            </Modal>
          </Col>
        </div>
      </Col>
    );
  }
}

Users.propTypes = {
  getUsersIfNeeded: PropTypes.func.isRequired,
  getItemsIfNeeded: PropTypes.func.isRequired,
  putUser: PropTypes.func.isRequired,
  postUser: PropTypes.func.isRequired,
  users: PropTypes.array.isRequired,
  items: PropTypes.array.isRequired,
  isGetting: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  dispatch: PropTypes.func.isRequired
};
function mapStateToProps(state) {
  const { user,item } = state;
  const {items} = item;
  const { isGetting, lastUpdated, users } = user;
  return { users, isGetting, lastUpdated,items };
}
export default connect(mapStateToProps)(Users);
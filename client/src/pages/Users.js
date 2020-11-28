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
import { getItemsIfNeeded } from "../actions/itemActions"
import {getAllTransactionsByUser,getDueTransactionsByUser} from "../actions/transactionActions"

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
      clearCoursesText:"",

      showImportExcelModal: false,
      showExportExcelModal: false,
      showClearCoursesModal:false,
      clearAllCoursesError:false,
      importedExcelData: [],
      importEmailErrors: {},
      transactions: [],

      selectedUserId: null,
      selectedUser: {
        fname: "",
        lname: "",
        courses: [],
        userCode: "",
        email: "",
        phone: "",
        notes: "",
        createdAt: "",
      },
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getUsersIfNeeded());
    dispatch(getItemsIfNeeded());
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      transactions: this.getTransactionsToShow(nextProps.transactions),
      dueTransactions:this.getDueTransactionsToShow(nextProps.dueTransactions)
    });
  }

  getTransactionsToShow(preSetTransactions) {
    if(preSetTransactions == null){
      return null;
    }
    else{
      preSetTransactions.forEach((transaction) => {
        transaction.backgroundColor =
          !transaction.checkedInDate &&
          new Date(transaction.dueDate).getTime() < new Date().getTime()
            ? "mistyrose"
            : "";
      });
      return preSetTransactions;
    }
  }

  getDueTransactionsToShow(preSetTransactions) {
    if(preSetTransactions == null){
      return [];
    }
    else{
      preSetTransactions.forEach((transaction) => {
        transaction.backgroundColor =
          new Date(transaction.dueDate).getTime() < new Date().getTime()
            ? "mistyrose"
            : "";
      });
      return preSetTransactions;
    }
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
        createdAt: "",
      },
      transactions: [],
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
    const {dispatch} = this.props;
    dispatch(getAllTransactionsByUser(rowData));
    dispatch(getDueTransactionsByUser(rowData))
    this.setState({
      selectedUserId: rowData.tableData.id,
      selectedUser: rowData,
    });
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

  handleConfirmClearAllCoursesClick = () => {
    const { dispatch } = this.props;
    if(
      this.state.clearCoursesText === "I confirm that I want to clear all courses"
    ) {
      this.props.users.forEach(user => {
        user.courses = [];
        dispatch(putUser(user));
      })
      this.setState({
        clearCoursesText: "",
        clearAllCoursesError:false,
      })
      dispatch(getUsersIfNeeded());
      this.closeClearCoursesModal();
    }else{
      this.setState({
        clearAllCoursesError:true,
      })
    }
  }

  handleClearAllCoursesClick = () => {
    this.setState({
      clearCoursesText: "",
      clearAllCoursesError:false,
      showClearCoursesModal:true,
    })
  };

  closeClearCoursesModal = () =>{
    this.setState({
      clearCoursesText: "",
      clearAllCoursesError:false,
      showClearCoursesModal:false,
    })
  }

  handleClearAllCoursesText = (e) => {
    const val = e.target.value;
    this.setState({
      clearCoursesText: val
    });
  }

  onChangeFile(event) {
    const fileObj = event.target.files[0];
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;

    reader.onload = (e) => {
      let wb;
      try {
        wb = XLSX.read(e.target.result, {
          type: rABS ? "binary" : "array",
          bookVBA: true,
        });
      }
      catch (err) {
        console.log("Incorrect file type.");
        return;
      }
      let usedUserCodes = [];
      const users = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
      if (!users[0]["First Name"] || !users[0]["Last Name"] || !users[0]["Username"]) {
        console.log("Error getting data from file.");
        return;
      }
      const data = users.map((user) => {
        let userCode = this.generateNewUserCode(usedUserCodes);
        usedUserCodes.push(parseInt(userCode));
        if (!user["First Name"] ||
          !user["Last Name"] ||
          !user["Username"]) {
          console.log("Failed to upload file.");
        }
        return {
          fname: user["First Name"],
          lname: user["Last Name"],
          courses: [],
          userCode: userCode,
          email: user["Username"] || user["Email"]
        }
      })
        .map((nuser) => {
          let eUser = this.props.users.find(
            (user) => user.email.toLowerCase() === nuser.email.toLowerCase()
          );
          if (eUser === undefined) eUser = nuser;
          this.setState({
            ["importEmailValid" +
              eUser.userCode]: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(
                eUser.email
              ),
          });
          return eUser;
        });

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
          let exists = this.props.users.find(u => u.email.toLowerCase() === user.email.toLowerCase());
          if (!exists) {
            user.courses = Array.from(new Set(user.courses.concat(this.state.selectedUser.courses)));
            dispatch(postUser(user));
          } else {
            exists.courses = Array.from(new Set(exists.courses.concat(this.state.selectedUser.courses)));
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
    // TODO: Fix this - makes changing email very slow
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
        return { selectedUser, isChangesMadeToModal: true };
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
          menuItem: "Active",
          render: () => (
            <Table
              title={
                this.state.selectedUser.fname +
                " " +
                this.state.selectedUser.lname
              }
              columns={[
                { title: "Item ID", field: "item.iid" },
                { title: "Item Name", field: "item.name" },
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
              data={this.state.dueTransactions}
              
            />
          ),
        },
        {
          menuItem: "Completed",
          render: () => (
            <Col className="stretch-h flex-col table-wrapper">
              <Table
                title={
                  this.state.selectedUser.fname +
                  " " +
                  this.state.selectedUser.lname
                }
                columns={[
                  { title: "Item ID", field: "item.iid" },
                  { title: "Item Name", field: "item.name" },
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
                data={this.state.transactions}
              />
            </Col>
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
        cellStyle: {width: '40%'},
        render: (rowData) => (
          <TextField
            defaultValue={rowData.email}
            error={!this.state["importEmailValid" + rowData.userCode]}
            helperText={
              !this.state["importEmailValid" + rowData.userCode]
                ? "Enter a valid email."
                : ""
            }
            className="import-users-email-input"
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
            if (value !== "All") {
              props.onFilterChanged(props.columnDef.tableData.id, value);
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
      <Col className="stretch-h flex-col" style={{ overflow: "hidden" }}>
        <div className="top-bar">
          <Row>
            <Col>
              <Button
                className="float-down"
                size="small"
                floated="left"
                style={{ backgroundColor: "#46C88C", color: "white" }}
                onClick={this.handleAddUserClick}
              >
                Create New User
              </Button>
            </Col>
            <Col xs="auto">
              <h1>User List</h1>
            </Col>
            <Col>
              <div className="float-down right-buttons">
                <Button
                  basic
                  floated="right"
                  color="red"
                  size="tiny"
                  onClick={this.handleClearAllCoursesClick}
                >
                  Clear All Courses
                </Button>
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
                  onClick={(event)=>{event.target.value=null}}
                />
              </div>
            </Col>
          </Row>
          <Divider clearing />
        </div>
        <div className="page-content stretch-h">
          <Col className="stretch-h flex-col table-wrapper">
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
                <Modal.Title>Import From Excel File</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Row>
                  <Col>
                    <Table
                      data={this.state.importedExcelData}
                      columns={importColumns}
                      title={<h3>New Users</h3>}
                    />

                  </Col>
                </Row>
              </Modal.Body>
              <Modal.Footer>
                <Dropdown
                  className="footer-dropdown"
                  placeholder="Select courses to add students to:"
                  name="courses"
                  multiple
                  search
                  selection
                  allowAdditions
                  options={courseOptions}
                  value={selectedUser.courses}
                  onChange={this.handleDropdownChange}
                />
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
            <Modal centered size ="lg" show={selectedUserId != null} onHide={this.close}>
              <Modal.Header bsPrefix="modal-header">
                <Modal.Title>User</Modal.Title>
                <IconButton onClick={this.close} size="small" color="inherit">
                  <ClearIcon />
                </IconButton>
              </Modal.Header>
              <Modal.Body>
                {this.state.activeItem === "user" &&
                  this.state.selectedUser !== null && (
                    <Form keyboardShortcuts = {false}>
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
                          <Button type ="button" color='blue'  disabled={this.state.editable} onKeyDown ={(e) =>{e.preventDefault()}} onClick={this.regenerateUserCode} >Genrate New User ID</Button>
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
                              selectedUser.createdAt
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
                    type="button"
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
                  type="button"
                  onClick={this.handleSubmitClick}
                >
                  {this.state.isChangesMadeToModal ? (
                    <Icon name="save"></Icon>
                  ) : null}
                  {this.state.isChangesMadeToModal ? this.state.selectedUserId < 0 ? "Create" : "Save" : "Close"}
                </Button>
              </Modal.Footer>
            </Modal>
            <Modal 
              show = {this.state.showClearCoursesModal}
              centered
              onHide={this.closeClearCoursesModal}
            >
              <Modal.Header bsPrefix="modal-header">
                <Modal.Title>Clear Courses</Modal.Title>
                <IconButton onClick={this.closeClearCoursesModal} size="small" color="inherit">
                  <ClearIcon />
                </IconButton>
              </Modal.Header>
              <Modal.Body>
                <p className = "non-selectable-course-text">Please type "<b>I confirm that I want to clear all courses</b>" if you would like to clear all the users' courses. This action can not be undone.</p>
                <Form>
                  <Form.Input error = {this.state.clearAllCoursesError} onChange = {this.handleClearAllCoursesText}></Form.Input >
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button onClick = {this.closeClearCoursesModal} variant="secondary">Close</Button>
                <Button onClick = {this. handleConfirmClearAllCoursesClick} variant="primary">Confirm</Button>
              </Modal.Footer>
            </Modal>
          </Col>
        </div>
      </Col>
    );
  }
}

Users.propTypes = {
  users: PropTypes.array.isRequired,
  transactions: PropTypes.array.isRequired,
  items: PropTypes.array.isRequired,
  isGetting: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  dispatch: PropTypes.func.isRequired
};
function mapStateToProps(state) {
  const { user, item, transaction} = state;
  const { items } = item;
  const {transactions,dueTransactions} = transaction;
  const { isGetting, lastUpdated, users } = user;
  return { users, isGetting, lastUpdated, items,transactions,dueTransactions };
}
export default connect(mapStateToProps)(Users);

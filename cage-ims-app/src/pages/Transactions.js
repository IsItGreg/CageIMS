import React, { Component } from "react";
import { Form, Divider, Button, Icon } from "semantic-ui-react";
import { Col, Row, Modal } from "react-bootstrap";
import Table from "../common/Table";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";

class Transactions extends Component {
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
        { title: "First Name", field: "fname", headerStyle: headerStyleGrey },
        { title: "Last Name", field: "lname", headerStyle: headerStyleGrey },
        { title: "Item Name", field: "name", headerStyle: headerStyleGrey },
        { title: "Item ID", field: "iid", headerStyle: headerStyleGrey },
        { title: "Category", field: "category", headerStyle: headerStyleGrey },
        {
          title: "Notes",
          field: "notes",
          headerStyle: headerStyleGrey,
          render: (rowData) => {
            return (
              rowData.notes && (
                <Icon size="large" className="notes-icon" name="check circle" />
              )
            );
          },
        },
        {
          title: "Checked Out",
          field: "checkedOutDate",
          headerStyle: headerStyleGrey,
          render: (rowData) => this.formatDate(rowData.checkedOutDate),
          customFilterAndSearch: (term, rowData) =>
            this.formatDateForSearchBar(rowData.checkedOutDate).indexOf(
              term
            ) !== -1 ||
            this.formatDate(rowData.checkedOutDate).indexOf(term) !== -1,
        },
        {
          title: "Due Date",
          field: "dueDate",
          headerStyle: headerStyleGrey,
          render: (rowData) => this.formatDate(rowData.dueDate),
          customFilterAndSearch: (term, rowData) =>
            this.formatDateForSearchBar(rowData.dueDate).indexOf(term) !== -1 ||
            this.formatDate(rowData.dueDate).indexOf(term) !== -1,
        },
        {
          title: "Checked In",
          field: "checkedInDate",
          headerStyle: headerStyleGrey,
          render: (rowData) => this.formatDate(rowData.checkedInDate),
          defaultSort: "dec",
          customFilterAndSearch: (term, rowData) =>
            this.formatDateForSearchBar(rowData.checkedInDate).indexOf(term) !==
              -1 || this.formatDate(rowData.checkedInDate).indexOf(term) !== -1,
        },
      ],
      selectedItemId: null,
      selectedItem: {
        fname: "",
        lname: "",
        name: "",
        iid: "",
        category: "",
        notes: "",
        checkedOutDate: "",
        checkedInDate: "",
        dueDate: "",
      },
    };
  }

  close = () =>
    this.setState({
      selectedItemId: null,
    });

  handleChange = (e, userProp) => {
    const val = e.target.value;
    this.setState((prevState) => {
      let selectedItem = Object.assign({}, prevState.selectedItem);
      selectedItem[userProp] = val;
      return { selectedItem };
    });
  };

  handleUserSelectClick = (e, rowData) => {
    this.setState({
      selectedItemId: rowData.tid,
      selectedItem: rowData,
    });
  };

  handleDropdownAddition = (e, { value }) => {
    this.setState((prevState) => ({
      courseOptions: [{ text: value, value }, ...prevState.courseOptions],
    }));
  };

  handleDropdownChange = (e, { value }) => {
    const val = value;
    this.setState((prevState) => {
      let selectedItem = Object.assign({}, prevState.selectedItem);
      selectedItem.courses = val;
      return { selectedItem };
    });
  };

  formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return (
      date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear()
    );
  };

  formatDateForSearchBar = (dateString) => {
    let monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    if (!dateString) return "";
    const date = new Date(dateString);
    console.log(date.getMonth());
    return (
      monthNames[date.getMonth()] +
      " " +
      date.getDate() +
      " " +
      date.getFullYear()
    );
  };

  render() {
    const selectedItemId = this.state.selectedItemId;
    const selectedItem = this.state.selectedItem;

    let transactions = Array.from(this.props.data.transactions);
    transactions.forEach((transaction) => {
      let result = this.props.data.users.filter(
        (user) => transaction.uid === user.uid
      );
      transaction.fname = result[0] ? result[0].fname : "";
      transaction.lname = result[0] ? result[0].lname : "";
      result = this.props.data.items.filter(
        (item) => transaction.iid === item.iid
      );
      transaction.name = result[0] ? result[0].name : "";
      transaction.iid = result[0] ? result[0].iid : "";
      transaction.category = result[0] ? result[0].category : "";

      transaction.backgroundColor =
        !transaction.checkedInDate &&
        new Date(transaction.dueDate).getTime() < new Date().getTime()
          ? "mistyrose"
          : "";
    });

    return (
      <Col className="stretch-h flex-col">
        <div className="top-bar">
          <Row>
            <Col>
              <Button
                className="float-down"
                style={{ backgroundColor: "#46C88C", color: "white" }}
                href="#/"
              >
                Create New Transaction
              </Button>
            </Col>
            <Col>
              <h1>Transaction History</h1>
            </Col>
            <Col />
          </Row>
          <Divider clearing />
        </div>
        <div className="page-content stretch-h">
          <Col className="stretch-h flex-col">
            <Table
              data={transactions}
              columns={this.state.columnSet}
              title={<h2>Transaction History</h2>}
              onRowClick={(event, rowData) =>
                this.handleUserSelectClick(event, rowData)
              }
            />
            <Modal centered show={selectedItemId != null} onHide={this.close}>
              <Modal.Header bsPrefix="modal-header">
                <Modal.Title>Transaction</Modal.Title>
                <IconButton onClick={this.close} size="small" color="inherit">
                  <ClearIcon />
                </IconButton>
              </Modal.Header>
              <Modal.Body>
                <Row>
                  <Col>
                    <Form>
                      <Form.Group widths="equal">
                        <Form.Field>
                          <label>Item Name:</label>
                          <Form.Input
                            name="name"
                            placeholder="name"
                            defaultValue={selectedItem.name}
                            readOnly
                          ></Form.Input>
                        </Form.Field>
                        <Form.Field>
                          <label>Category:</label>
                          <Form.Input
                            name="category"
                            placeholder="Category"
                            defaultValue={selectedItem.category}
                            readOnly
                          ></Form.Input>
                        </Form.Field>
                      </Form.Group>
                      <Form.Field>
                        <label>Rented by:</label>
                        <Form.Group widths="equal">
                          <Form.Input
                            name="fname"
                            placeholder="First Name"
                            defaultValue={selectedItem.fname}
                            readOnly
                          ></Form.Input>
                          <Form.Input
                            name="lname"
                            placeholder="Last Name"
                            defaultValue={selectedItem.lname}
                            readOnly
                          ></Form.Input>
                        </Form.Group>
                      </Form.Field>
                      <Form.Field>
                        <label>Item ID:</label>
                        <Form.Input
                          name="iid"
                          placeholder="Item ID"
                          defaultValue={selectedItem.iid}
                          readOnly
                        ></Form.Input>
                      </Form.Field>
                      <Form.Field>
                        <label>Notes:</label>
                        <Form.Input
                          name="notes"
                          placeholder="Notes"
                          defaultValue={selectedItem.notes}
                          readOnly
                        ></Form.Input>
                      </Form.Field>
                      <Form.Group
                        widths={this.state.selectedItem.checkedInDate ? 3 : 2}
                      >
                        <Form.Field>
                          <label>Checked Out:</label>
                          <Form.Input
                            name="checkedOut"
                            placeholder="Checked Out"
                            defaultValue={this.formatDate(
                              selectedItem.checkedOutDate
                            )}
                            readOnly
                          ></Form.Input>
                        </Form.Field>
                        {this.state.selectedItem.checkedInDate && (
                          <Form.Field>
                            <label>Checked In:</label>
                            <Form.Input
                              name="checkedIn"
                              placeholder="Checked In"
                              error={!selectedItem.checkedInDate}
                              defaultValue={this.formatDate(
                                selectedItem.checkedInDate
                              )}
                              readOnly
                            ></Form.Input>
                          </Form.Field>
                        )}
                        <Form.Field>
                          <label>Due Date:</label>
                          <Form.Input
                            name="due"
                            placeholder="Due Date"
                            defaultValue={this.formatDate(selectedItem.dueDate)}
                            readOnly
                          ></Form.Input>
                        </Form.Field>
                      </Form.Group>
                    </Form>
                  </Col>
                </Row>
              </Modal.Body>
            </Modal>
          </Col>
        </div>
      </Col>
    );
  }
}

export default Transactions;

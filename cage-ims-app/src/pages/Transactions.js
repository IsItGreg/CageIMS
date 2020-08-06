import React, { Component } from "react";
import { Divider, Button, Form, Dropdown, Tab } from "semantic-ui-react";
import { Col, Row, Modal } from "react-bootstrap";
import Table from "../common/Table";

class Transactions extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      columnSet: [
        { title: "First Name", field: "fname" },
        { title: "Last Name", field: "lname" },
        { title: "Item Name", field: "name" },
        { title: "Category", field: "category" },
        { title: "Notes", field: "notes" },
        {
          title: "Checked Out",
          field: "checkedOutDate",
          render: (rowData) => this.formatDate(rowData.checkedOutDate),
        },
        {
          title: "Due Date",
          field: "dueDate",
          render: (rowData) => this.formatDate(rowData.dueDate),
        },
        {
          title: "Checked In",
          field: "checkedInDate",
          render: (rowData) => this.formatDate(rowData.checkedInDate),
        },
      ],
      open: false,

      selectedItemId: null,
      selectedItem: {
        fname: "",
        lname: "",
        name: "",
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
      transaction.category = result[0] ? result[0].category : "";

      transaction.backgroundColor =
        !transaction.checkedInDate &&
        new Date(transaction.dueDate).getTime() < new Date().getTime()
          ? "mistyrose"
          : "";
    });

    const courseOptions = this.state.courseOptions;
    return (
      <div className="page-content stretch-h">
        <Col className="stretch-h flex-col">
          <Table
            data={transactions}
            columns={this.state.columnSet}
            title={<h2>Transactions</h2>}
            onRowClick={(event, rowData) =>
              this.handleUserSelectClick(event, rowData)
            }
          />
          <Modal
            centered
            size={this.state.selectedItemId >= 0 ? "lg" : "lg"}
            show={selectedItemId != null}
            onHide={this.close}
          >
            <Modal.Header closeButton bsPrefix="modal-header">
              <Modal.Title>Item</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col>
                  <Form>
                    <Form.Field>
                      <label>
                        First Name:
                        {this.state.nameError && (
                          <span className="error-text modal-label-error-text">
                            Error: Field cannot be empty.
                          </span>
                        )}
                      </label>
                      <Form.Input
                        error={this.state.nameError}
                        name="fname"
                        placeholder="First Name"
                        defaultValue={selectedItem.fname}
                        readOnly
                      ></Form.Input>
                    </Form.Field>
                    <Form.Field>
                      <label>
                        Last Name:
                        {this.state.nameError && (
                          <span className="error-text modal-label-error-text">
                            Error: Field cannot be empty.
                          </span>
                        )}
                      </label>
                      <Form.Input
                        error={this.state.nameError}
                        name="lname"
                        placeholder="Last Name"
                        defaultValue={selectedItem.lname}
                        readOnly
                      ></Form.Input>
                    </Form.Field>
                    <Form.Field>
                      <label>
                        Item Name:
                        {this.state.categoryError && (
                          <span className="error-text modal-label-error-text">
                            Error: Field cannot be empty.
                          </span>
                        )}
                      </label>
                      <Form.Input
                        error={this.state.categoryError}
                        name="name"
                        placeholder="name"
                        defaultValue={selectedItem.category}
                        readOnly
                      ></Form.Input>
                    </Form.Field>
                    <Form.Field>
                      <label>
                        Category:
                        {this.state.notesError && (
                          <span className="error-text modal-label-error-text">
                            Error: Field cannot be empty.
                          </span>
                        )}
                      </label>
                      <Form.Input
                        name="category"
                        error={this.state.notesError}
                        placeholder="Category"
                        defaultValue={selectedItem.notes}
                        readOnly
                      ></Form.Input>
                    </Form.Field>
                    <Form.Field>
                      <label>
                        Serial:
                        {this.state.serialError && (
                          <span className="error-text modal-label-error-text">
                            Error: Field cannot be empty.
                          </span>
                        )}
                      </label>
                      <Form.Input
                        name="serial"
                        error={this.state.serialError}
                        placeholder="Serial"
                        defaultValue={selectedItem.serial}
                        onChange={(e) => {
                          this.handleChange(e, "serial");
                        }}
                        readOnly
                      ></Form.Input>
                    </Form.Field>
                    <Form.Field>
                      <label>
                        Notes:
                        {this.state.notesError && (
                          <span className="error-text modal-label-error-text">
                            Error: Field cannot be empty.
                          </span>
                        )}
                      </label>
                      <Form.Input
                        name="notes"
                        error={this.state.notesError}
                        placeholder="Notes"
                        defaultValue={selectedItem.notes}
                        onChange={(e) => {
                          this.handleChange(e, "notes");
                        }}
                        readOnly
                      ></Form.Input>
                    </Form.Field>
                    <Form.Field>
                      <label>Checked Out:</label>
                      <Form.Input
                        name="checkedOut"
                        placeholder="Checked Out"
                        defaultValue={selectedItem.checkedOutDate}
                        onChange={(e) => {
                          this.handleChange(e, "checkedOutDate");
                        }}
                        readOnly
                      ></Form.Input>
                    </Form.Field>
                    <Form.Field>
                      <label>Checked In:</label>
                      <Form.Input
                        name="checkedIn"
                        placeholder="Checked In"
                        error={!selectedItem.checkedInDate}
                        defaultValue={selectedItem.checkedInDate}
                        onChange={(e) => {
                          this.handleChange(e, "checkedInDate");
                        }}
                        readOnly
                      ></Form.Input>
                    </Form.Field>
                    <Form.Field>
                      <label>Due Date:</label>
                      <Form.Input
                        name="due"
                        placeholder="Due Date"
                        defaultValue={selectedItem.dueDate}
                        onChange={(e) => {
                          this.handleChange(e, "dueDate");
                        }}
                        readOnly
                      ></Form.Input>
                    </Form.Field>
                  </Form>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer></Modal.Footer>
          </Modal>
        </Col>
      </div>
    );
  }
}

export default Transactions;

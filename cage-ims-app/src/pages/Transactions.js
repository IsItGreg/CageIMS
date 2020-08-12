import React, { Component } from "react";
import { Form, Divider, Button } from "semantic-ui-react";
import { Col, Row, Modal } from "react-bootstrap";
import Table from "../common/Table";

class Transactions extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      columnSet: [
        { title: "First Name", field: "fname", defaultSort: "asc" },
        { title: "Last Name", field: "lname" },
        { title: "Item Name", field: "name" },
        { title: "Item ID", field: "iid" },
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
          <Button basic href="#/">
            Create New Transaction
          </Button>
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
                        <label>First Name: </label>
                        <Form.Input
                          name="fname"
                          placeholder="First Name"
                          defaultValue={selectedItem.fname}
                          readOnly
                        ></Form.Input>
                      </Form.Field>
                      <Form.Field>
                        <label>Last Name:</label>
                        <Form.Input
                          name="lname"
                          placeholder="Last Name"
                          defaultValue={selectedItem.lname}
                          readOnly
                        ></Form.Input>
                      </Form.Field>
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
                      <Form.Field>
                        <label>Due Date:</label>
                        <Form.Input
                          name="due"
                          placeholder="Due Date"
                          defaultValue={this.formatDate(selectedItem.dueDate)}
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
      </Col>
    );
  }
}

export default Transactions;

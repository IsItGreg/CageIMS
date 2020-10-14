import React, { Component } from "react";
import { Form, Divider, Button, Icon } from "semantic-ui-react";
import { Col, Row, Modal } from "react-bootstrap";
import Table from "../common/Table";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getTransactionsIfNeeded, putTransaction, postTransaction } from "../actions/transactionActions"
import { getUsersIfNeeded} from "../actions/userActions"
import { getItemsIfNeeded} from "../actions/itemActions"

class Transactions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedTransactionId: null,
      selectedTransaction: {
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

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getUsersIfNeeded());
    dispatch(getItemsIfNeeded());
    dispatch(getTransactionsIfNeeded());
  }

  close = () =>{
    this.setState({
      selectedTransactionId: null,
    });
    const { dispatch } = this.props;
    dispatch(getTransactionsIfNeeded());
  }


  handleUserSelectClick = (e, rowData) => {
    this.setState({
      selectedTransactionId: rowData.tableData.id,
      selectedTransaction: rowData,
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
    const {transactions} = this.props;
    const selectedTransactionId = this.state.selectedTransactionId;
    const selectedTransaction = this.state.selectedTransaction;
    const headerStyleGrey = {
      backgroundColor: "#E2E2E2",
      color: "black",
      fontSize: "24",
    };

    const columnSet = [
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
        defaultSort: "desc",
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
        customFilterAndSearch: (term, rowData) =>
          this.formatDateForSearchBar(rowData.checkedInDate).indexOf(term) !==
            -1 || this.formatDate(rowData.checkedInDate).indexOf(term) !== -1,
      },
    ];

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
              data={Array.from(transactions)}
              columns={columnSet}
              title={<h2>Transaction History</h2>}
              onRowClick={(event, rowData) =>
                this.handleUserSelectClick(event, rowData)
              }
            />
            <Modal centered show={this.state.selectedTransactionId != null} onHide={this.close}>
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
                            defaultValue={selectedTransaction.name}
                            readOnly
                          ></Form.Input>
                        </Form.Field>
                        <Form.Field>
                          <label>Category:</label>
                          <Form.Input
                            name="category"
                            placeholder="Category"
                            defaultValue={selectedTransaction.category}
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
                            defaultValue={selectedTransaction.fname}
                            readOnly
                          ></Form.Input>
                          <Form.Input
                            name="lname"
                            placeholder="Last Name"
                            defaultValue={selectedTransaction.lname}
                            readOnly
                          ></Form.Input>
                        </Form.Group>
                      </Form.Field>
                      <Form.Field>
                        <label>Item ID:</label>
                        <Form.Input
                          name="iid"
                          placeholder="Item ID"
                          defaultValue={selectedTransaction.iid}
                          readOnly
                        ></Form.Input>
                      </Form.Field>
                      <Form.Field>
                        <label>Notes:</label>
                        <Form.Input
                          name="notes"
                          placeholder="Notes"
                          defaultValue={selectedTransaction.notes}
                          readOnly
                        ></Form.Input>
                      </Form.Field>
                      <Form.Group
                        widths={this.state.selectedTransaction.checkedInDate ? 3 : 2}
                      >
                        <Form.Field>
                          <label>Checked Out:</label>
                          <Form.Input
                            name="checkedOut"
                            placeholder="Checked Out"
                            defaultValue={this.formatDate(
                              selectedTransaction.checkedOutDate
                            )}
                            readOnly
                          ></Form.Input>
                        </Form.Field>
                        {this.state.selectedTransaction.checkedInDate && (
                          <Form.Field>
                            <label>Checked In:</label>
                            <Form.Input
                              name="checkedIn"
                              placeholder="Checked In"
                              error={!selectedTransaction.checkedInDate}
                              defaultValue={this.formatDate(
                                selectedTransaction.checkedInDate
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
                            defaultValue={this.formatDate(selectedTransaction.dueDate)}
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

Transactions.propTypes = {
  //getUsersIfNeeded: PropTypes.func.isRequired,
  //getItemsIfNeeded: PropTypes.func.isRequired,
  getTransactionsIfNeeded:  PropTypes.func.isRequired,
  putTransaction: PropTypes.func.isRequired,
  postTransaction: PropTypes.func.isRequired,
  //users: PropTypes.array.isRequired,
  items: PropTypes.array.isRequired,
  transactions: PropTypes.array.isRequired,
  isGetting: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  dispatch: PropTypes.func.isRequired
};
function mapStateToProps(state) {
  const { transaction,item,user } = state;
  const {items} = item;
  const {users} = user;
  const { isGetting, lastUpdated, transactions } = transaction;
  return {isGetting, lastUpdated,transactions,items,users };
}
export default connect(mapStateToProps)(Transactions);

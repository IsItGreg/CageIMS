import React, { Component } from "react";
import { Button, Icon, Form, Tab } from "semantic-ui-react";
import { Col, Row, Modal } from "react-bootstrap";
import Table from "../common/Table";
import { KeyboardDatePicker, DatePicker } from "@material-ui/pickers";
import IconButton from "@material-ui/core/IconButton";
import DateRange from "@material-ui/icons/DateRange";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import {getAvailableItems } from "../actions/itemActions"
import { getTransactionsByUser, putTransaction, postTransaction } from "../actions/transactionActions"

class CheckInOutViewUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      op: "",

      selectedItemId: null,
      selectedItem: {},

      selectedItemsToReturn: [],

      transactions: [],
      items: [],

      newTransactions: [],

      isCheckoutModalOpen: false,
      isCheckoutModalAllDateSelectorOpen: false,
    };
  }

  getTransactionsToShow = (preSetTransactions) => {
    if (preSetTransactions == null) {
      return null;
    }
    preSetTransactions.forEach((transaction) => {
      transaction.backgroundColor =
        !transaction.checkedInDate &&
          new Date(transaction.dueDate).getTime() < new Date().getTime()
          ? "mistyrose"
          : "";
    });
    return preSetTransactions;
  };

  getItemsToShow = (preSetItems) => {
    if(preSetItems == null) {
      return null;
    }
    let items = Array.from(
      (preSetItems ? preSetItems : this.props.items).filter(
        (item) =>
          (item.hasOwnProperty('activeTransaction') && item.activeTransaction.length == 0)&&
          this.props.selectedUser.courses.some((course) =>
            item.courses.includes(course)
          )
      )
    );
    return items;
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(getTransactionsByUser(this.props.selectedUser))
    dispatch(getAvailableItems());
    this.setState({
      transactions: this.getTransactionsToShow(null),
      items: this.getItemsToShow(null),
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      transactions: this.getTransactionsToShow(nextProps.transactions),
      items: this.getItemsToShow(nextProps.items),
    });
  }

  handleDoneClick = () => {
    this.props.onDoneClick();
  };

  handleOpSelectClick = (e, op) => {
    this.state.transactions.forEach((transaction) => {
      if (transaction.tableData) transaction.tableData.checked = false;
    });
    this.state.items.forEach((item) => {
      if (item.tableData) item.tableData.checked = false;
    });
    this.setState({ op, isCheckoutModalOpen: false });
  };

  close = () =>
    this.setState({
      selectedItemId: null,
      isCheckoutModalOpen: false,
    });

  handleChange = (e, userProp) => {
    const val = e.target.value;
    this.setState((prevState) => {
      let selectedItem = Object.assign({}, prevState.selectedItem);
      selectedItem[userProp] = val;
      return { selectedItem };
    });
  };

  handleRowItemClick = (e, rowData, rowClick = true) => {
    if (this.state.op === "checkin") {
      let transactions = this.state.transactions;
      const index = transactions.indexOf(rowData);
      transactions[index].tableData.checked = !transactions[index].tableData
        .checked;
      this.setState({ transactions });
    } else if (this.state.op === "checkout") {
      let items = this.state.items;
      const item = items.find((item) => item.iid === rowData.iid);
      if (rowClick) item.tableData.checked = !item.tableData.checked;
      this.setState({ items });
    } else {
      this.setState({
        selectedItemId: rowData._id,
        selectedItem: rowData,
      });
    }
  };

  handleReturnSelectedItemsClick = (e) => {
    const { dispatch } = this.props;
    const completedTransactionIds = this.state.transactions
      .filter((transaction) => transaction.tableData?.checked);
    let t = completedTransactionIds.forEach((id) => {
      id.checkedInDate = new Date().getTime();
      dispatch(putTransaction(id));
    });

    dispatch(getTransactionsByUser(this.props.selectedUser));
    dispatch(getAvailableItems())
    this.setState(
      {
        transactions: this.getTransactionsToShow(null),
        items: this.getItemsToShow(null),
      },
      this.handleOpSelectClick(e, "")
    );
  };


  handleCheckOutCartButtonClick = (e) => {
    const itemsToCheckOut = this.state.items.filter(
      (item) => item.tableData?.checked
    );
    let newTransactions = [];
    itemsToCheckOut.forEach((item) => {
      newTransactions.push({
        user_id: this.props.selectedUser._id,
        item_id: item._id,
        checkedOutDate: new Date().getTime(),
        dueDate: "",
        checkedInDate: "",
      });
    });

    this.setState({ newTransactions, isCheckoutModalOpen: true });
  };

  handleConfirmCheckOutButtonClick = (e) => {
    if (this.state.newTransactions.some((transaction) => !transaction.dueDate))
      return;
    const { dispatch } = this.props;
    let user = Object.assign({}, this.props.selectedUser);
    this.state.newTransactions.forEach(
      (transaction) => {
        dispatch(postTransaction(transaction));
      }
    );
    dispatch(getTransactionsByUser(this.props.selectedUser));
    dispatch(getAvailableItems())
    this.setState(
      {
        transactions: this.getTransactionsToShow(null),
        items: this.getItemsToShow(null),
      },
      this.handleOpSelectClick(e, "")
    );
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

    const handleDateChange = (date, iid) => {
      let newTransactions = Array.from(this.state.newTransactions);
      newTransactions.find(
        (transaction) => transaction.item_id === iid
      ).dueDate = date.getTime();
      this.setState({ newTransactions });
    };

    const handleAllCheckoutDateChange = (date) => {
      let newTransactions = Array.from(this.state.newTransactions);
      newTransactions.forEach(
        (transaction) => (transaction.dueDate = date.getTime())
      );
      this.setState({
        newTransactions,
        isCheckoutModalAllDateSelectorOpen: false,
      });
    };

    const currentlyHeldColumnSet = [
      {
        title: "Item Name",
        field: "item.name",
      },
      {
        title: "Category",
        field: "item.category",
      },
      { title: "Transaction Notes", field: "notes" },
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
    ];

    const itemsColumnSet = [
      { title: "Item Name", field: "name" },
      { title: "Category", field: "category" },
      { title: "Notes", field: "notes" },
    ];

    const cartColumnSet = [
      { title: "Item Name", field: "name" },
      { title: "Category", field: "category" },
    ];

    const checkOutColumnSet = [
      { title: "Item Name", field: "name" },
      { title: "Category", field: "category" },
      {
        title: "Due Date",
        field: "dueDate",
        render: (rowData) => (
          <KeyboardDatePicker
            autoOk
            error={
              !this.state.newTransactions.find(
                (transaction) => rowData._id === transaction.item_id
              ).dueDate
            }
            variant="inline"
            inputVariant="outlined"
            label="Select due date"
            format="MM/dd/yyyy"
            value={
              this.state.newTransactions.find(
                (transaction) => rowData._id === transaction.item_id
              ).dueDate
                ? new Date(
                  this.state.newTransactions.find(
                    (transaction) => rowData._id === transaction.item_id
                  ).dueDate
                )
                : null
            }
            InputAdornmentProps={{ position: "end" }}
            onChange={(date) => handleDateChange(date, rowData._id)}
          />
        ),
      },
    ];

    let itemPanes = [
      {
        menuItem: "All",
        render: () => (
          <Table
            data={this.state.items}
            itemType={"item"}
            columns={itemsColumnSet}
            title={<h3>All</h3>}
            onRowClick={(event, rowData) => {
              this.handleRowItemClick(event, rowData);
            }}
            onSelectionChange={(rowData, event) => {
              this.handleRowItemClick(event, rowData, false);
            }}
            options={{ selection: true }}
          />
        ),
      },
    ];

    const categories = [
      ...new Set(this.state.items.map((item) => item.category)),
    ].sort();
    categories.forEach((category) => {
      itemPanes.push({
        menuItem: category,
        render: () => (
          <Table
            data={this.state.items.filter((item) => item.category === category)}
            itemType={"item"}
            columns={itemsColumnSet}
            title={<h3>{category}</h3>}
            onRowClick={(event, rowData) =>
              this.handleRowItemClick(event, rowData)
            }
            onSelectionChange={(rowData, event) => {
              this.handleRowItemClick(event, rowData, false);
            }}
            options={{ selection: true }}
          />
        ),
      });
    });

    const cartPanes = [
      {
        menuItem: "",
        render: () => (
          <Table
            data={JSON.parse(
              JSON.stringify(
                this.state.items.filter((item) => item.tableData?.checked)
              )
            )}
            itemType={"item"}
            columns={cartColumnSet}
            title={<h3>Cart</h3>}
            onRowClick={(event, rowData) =>
              this.handleRowItemClick(event, rowData)
            }
            onSelectionChange={(event, rowData) => {
              this.handleRowItemClick(event, rowData, false);
            }}
            options={{ selection: true, search: false }}
          />
        ),
      },
    ];

    let pageOp;
    if (this.state.op === "checkin") {
      pageOp = (
        <div className="checkinout-viewuser">
          <Row className="page-menu">
            <h1>
              {this.props.selectedUser.fname +
                " " +
                this.props.selectedUser.lname}{" "}
                -- Check In/Return
              </h1>
            <Button
              onClick={(e) => {
                this.handleOpSelectClick(e, "");
              }}
              size="big"
              animated
              color="green"
            >
              <Button.Content visible>Back</Button.Content>
              <Button.Content hidden>
                <Icon name="arrow circle left" />
              </Button.Content>
            </Button>
          </Row>
          <Row>
            <div className="current-table-container">
              <Table
                data={this.state.transactions}
                itemType={"item"}
                columns={currentlyHeldColumnSet}
                title={<h3>Currently held items:</h3>}
                onRowClick={(event, rowData) =>
                  this.handleRowItemClick(event, rowData)
                }
                options={{ selection: true }}
              />
            </div>
          </Row>
          <Row className="flex-end">
            <Button
              onClick={(e) => {
                this.handleOpSelectClick(e, "");
              }}
              color="red"
              size="big"
            >
              <Button.Content visible>Cancel</Button.Content>
            </Button>
            <Button
              onClick={(e) => {
                this.handleReturnSelectedItemsClick(e);
              }}
              color="orange"
              size="big"
            >
              <Button.Content visible>Return Selected Items</Button.Content>
            </Button>
          </Row>
        </div>
      );
    } else if (this.state.op === "checkout") {
      pageOp = (
        <div className="checkinout-viewuser">
          <Row className="page-menu">
            <h1>
              {this.props.selectedUser.fname +
                " " +
                this.props.selectedUser.lname}{" "}
                -- Check Out/Borrow
              </h1>
            <Button
              onClick={(e) => {
                this.handleOpSelectClick(e, "");
              }}
              size="big"
              animated
              color="green"
            >
              <Button.Content visible>Back</Button.Content>
              <Button.Content hidden>
                <Icon name="arrow circle left" />
              </Button.Content>
            </Button>
          </Row>
          <Row>
            <div className="checkout-table-wrapper">
              <Tab className="checkout-inv-table" panes={itemPanes} />
              <Tab className="checkout-cart-table" panes={cartPanes} />
              <Modal
                centered
                size={this.state.selectedUserId >= 0 ? "xl" : "lg"}
                show={this.state.isCheckoutModalOpen}
                onHide={this.close}
              >
                <Modal.Header bsPrefix="modal-header">
                  <Modal.Title>Check Out</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Row>
                    <Col>
                      <Table
                        data={JSON.parse(
                          JSON.stringify(
                            this.state.items.filter(
                              (item) => item.tableData?.checked
                            )
                          )
                        )}
                        itemType={"item"}
                        columns={checkOutColumnSet}
                        title={<h3>Cart</h3>}
                        options={{ selection: false, search: false }}
                        toolbarComponents={
                          <div className="toolbarSetAllDate">
                            <div>
                              Set all due dates:
                                <IconButton
                                onClick={() =>
                                  this.setState({
                                    isCheckoutModalAllDateSelectorOpen: true,
                                  })
                                }
                              >
                                <DateRange />
                              </IconButton>
                              <DatePicker
                                autoOk
                                variant="inline"
                                // ERROR: issue with open not finding correct render location,
                                //   seems like it might be resolved in next datepicker update
                                //   update plugin when possible
                                //   otherwise will work temporarily
                                open={
                                  this.state.isCheckoutModalAllDateSelectorOpen
                                }
                                onClose={() =>
                                  this.setState({
                                    isCheckoutModalAllDateSelectorOpen: false,
                                  })
                                }
                                format="MM/dd/yyyy"
                                onChange={(date) =>
                                  handleAllCheckoutDateChange(date)
                                }
                                value={null}
                                style={{ display: "none" }}
                              />
                            </div>
                          </div>
                        }
                      />
                    </Col>
                  </Row>
                </Modal.Body>
                <Modal.Footer>
                  <Button
                    onClick={(e) => {
                      this.close();
                    }}
                    color="red"
                    size="big"
                  >
                    <Button.Content visible>Cancel</Button.Content>
                  </Button>
                  <Button
                    onClick={(e) => {
                      this.handleConfirmCheckOutButtonClick(e);
                    }}
                    color="blue"
                    size="big"
                  >
                    <Button.Content visible>Confirm Check Out</Button.Content>
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          </Row>
          <Row className="flex-end">
            <Button
              onClick={(e) => {
                this.handleOpSelectClick(e, "");
              }}
              color="red"
              size="big"
            >
              <Button.Content visible>Cancel</Button.Content>
            </Button>
            <Button
              onClick={(e) => {
                this.handleCheckOutCartButtonClick(e);
              }}
              color="blue"
              size="big"
            >
              <Button.Content visible>Check Out Selected Items</Button.Content>
            </Button>
          </Row>
        </div>
      );
    } else {
      pageOp = (
        <div className="checkinout-viewuser">
          <Row className="page-menu">
            <h1>
              {this.props.selectedUser.fname +
                " " +
                this.props.selectedUser.lname}
            </h1>
            <Button
              onClick={this.handleDoneClick}
              size="big"
              animated
              color="green"
            >
              <Button.Content visible>Complete Transactions</Button.Content>
              <Button.Content hidden>
                <Icon name="check" />
              </Button.Content>
            </Button>
          </Row>
          <Row>
            <div className="current-table-container">
              <Table
                data={this.state.transactions}
                itemType={"item"}
                columns={currentlyHeldColumnSet}
                title={<h3>Currently held items:</h3>}
                onRowClick={(event, rowData) =>
                  this.handleRowItemClick(event, rowData)
                }
              />
              <Modal
                centered
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
                        <Form.Group widths={2}>
                          <Form.Field>
                            <label>
                              First Name:
                            </label>
                            <Form.Input
                              name="fname"
                              placeholder="First Name"
                              defaultValue={selectedItem.user ? selectedItem.user.fname : null}
                              readOnly
                            ></Form.Input>
                          </Form.Field>
                          <Form.Field>
                            <label>
                              Last Name:
                            </label>
                            <Form.Input
                              name="lname"
                              placeholder="Last Name"
                              defaultValue={selectedItem.user ? selectedItem.user.lname : null}
                              readOnly
                            ></Form.Input>
                          </Form.Field>
                        </Form.Group>
                        <Form.Group widths={2}>
                          <Form.Field>
                            <label>
                              Item Name:
                            </label>
                            <Form.Input
                              name="name"
                              placeholder="name"
                              defaultValue={selectedItem.user ? selectedItem.item.name : null}
                              readOnly
                            ></Form.Input>
                          </Form.Field>
                          <Form.Field>
                            <label>
                              Category:
                            </label>
                            <Form.Input
                              name="category"
                              placeholder="Category"
                              defaultValue={selectedItem.user ? selectedItem.item.category : null}
                              readOnly
                            ></Form.Input>
                          </Form.Field>
                        </Form.Group>
                        <Form.Field>
                          <label>
                            Item ID:
                            </label>
                          <Form.Input
                            name="iid"
                            placeholder="Item ID"
                            defaultValue={selectedItem.user ? selectedItem.item.iid : null}
                            readOnly
                          ></Form.Input>
                        </Form.Field>
                        <Form.Field>
                          <label>
                            Notes:
                            </label>
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
            </div>
          </Row>
          <Row className="checkinout-buttons">
            <Button
              onClick={(e) => {
                this.handleOpSelectClick(e, "checkin");
              }}
              color="orange"
              size="big"
            >
              <Button.Content visible>Return Items</Button.Content>
            </Button>
            <Button
              onClick={(e) => {
                this.handleOpSelectClick(e, "checkout");
              }}
              color="blue"
              size="big"
            >
              <Button.Content visible>Check Out Items</Button.Content>
            </Button>
          </Row>
        </div>
      );
    }

    return pageOp;
  }
}

CheckInOutViewUser.propTypes = {
  getUsersIfNeeded: PropTypes.func.isRequired,
  getAvailableItems: PropTypes.func.isRequired,
  getUser: PropTypes.func.isRequired,
  putUser: PropTypes.func.isRequired,
  postTransaction: PropTypes.func.isRequired,
  transactions: PropTypes.array.isRequired,
  items: PropTypes.array.isRequired,
  sentUser: PropTypes.object.isRequired,
  isGetting: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  dispatch: PropTypes.func.isRequired
};
function mapStateToProps(state) {
  const { transaction, item, user } = state;
  const { sentUser } = user;
  const { items } = item;
  const { transactions, isGetting, lastUpdated } = transaction;
  return { isGetting, lastUpdated, transactions, items, sentUser };
}
export default connect(mapStateToProps)(CheckInOutViewUser);


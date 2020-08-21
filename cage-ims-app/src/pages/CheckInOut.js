import React, { Component } from "react";
import { Input, Button, Icon, Form, Tab } from "semantic-ui-react";
import { Container, Col, Row, Modal } from "react-bootstrap";
import Table from "../common/Table";
import { KeyboardDatePicker, DatePicker } from "@material-ui/pickers";
import IconButton from "@material-ui/core/IconButton";
import DateRange from "@material-ui/icons/DateRange";

class CheckInOut extends Component {
  constructor(props) {
    super(props);
    this.handleSearchResult = this.handleSearchResult.bind(this);
    this.handleTransactionsChanges = this.handleDataChanges.bind(this);
    this.state = {
      error: false,
      userFound: "",
      // {
      //     fname: "Greg",
      //     lname: "Smelkov",
      //     uid: "12345",
      //     courses: ["Photography I", "Photography II"],
      // },
    };
  }

  handleSearchResult(userFound) {
    // console.log(userFound);
    this.setState({ userFound });
  }

  handleDataChanges(data) {
    this.props.onUpdateData(data);
  }

  render() {
    const userFound = this.state.userFound;
    let page;
    if (!userFound)
      page = (
        <Search
          users={this.props.data.users}
          onSuccessfulSearchResult={this.handleSearchResult}
        />
      );
    else
      page = (
        <CheckInOutViewUser
          data={this.props.data}
          onDoneClick={this.handleSearchResult}
          selectedUser={this.state.userFound}
          onUpdateData={this.handleTransactionsChanges}
        />
      );
    return <Container className="checkinout">{page}</Container>;
  }
}

export default CheckInOut;

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
    };
  }

  handleChange = (e) => {
    this.setState({ searchInput: e.target.value });
  };

  handleSearchButtonClick = () => {
    const users = this.props.users.filter(
      (user) => user.uid === this.state.searchInput
    );
    if (users.length > 0) {
      this.props.onSuccessfulSearchResult(users[0]);
    } else {
      this.setState({ error: true });
    }
  };

  handleKeyDown = (e) => {
    if (e.key === "Enter") {
      this.handleSearchButtonClick();
    }
  };

  render() {
    const isError = this.state.error;
    return (
      <div className="checkinout-search">
        <h1>Check In/Out</h1>
        <Input
          error={this.state.error}
          onChange={this.handleChange}
          onKeyPress={this.handleKeyDown}
          size="huge"
          fluid
          icon="users"
          iconPosition="left"
          placeholder="Search by exact ID..."
        />
        {isError && (
          <div className="error-text">
            <p>Error: ID is invalid.</p>
          </div>
        )}
        <Button size="big" animated onClick={this.handleSearchButtonClick}>
          <Button.Content visible>Search</Button.Content>
          <Button.Content hidden>
            <Icon name="search" />
          </Button.Content>
        </Button>
      </div>
    );
  }
}

class CheckInOutViewUser extends React.Component {
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
    let transactions = Array.from(
      (preSetTransactions
        ? preSetTransactions
        : this.props.data.transactions
      ).filter(
        (item) =>
          item.uid === this.props.selectedUser.uid && !item.checkedInDate
      )
    );
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
    return transactions;
  };

  getItemsToShow = (preSetItems) => {
    let items = Array.from(
      (preSetItems ? preSetItems : this.props.data.items).filter(
        (item) =>
          !item.atid &&
          this.props.selectedUser.courses.some((course) =>
            item.courses.includes(course)
          )
      )
    );
    return items;
  };

  componentDidMount() {
    this.setState({
      transactions: this.getTransactionsToShow(),
      items: this.getItemsToShow(),
    });
  }

  handleDoneClick = () => {
    this.props.onDoneClick("");
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
        selectedItemId: rowData.tid,
        selectedItem: rowData,
      });
    }
  };

  handleReturnSelectedItemsClick = (e) => {
    let data = Object.assign({}, this.props.data);
    const completedTransactionIds = this.state.transactions
      .filter((transaction) => transaction.tableData?.checked)
      .map((transaction) => transaction.tid);
    completedTransactionIds.forEach((id) => {
      let transaction = data.transactions.find(
        (transaction) => transaction.tid === id
      );
      transaction.checkedInDate = new Date().getTime();
      let item = data.items.find((item) => item.iid === transaction.iid);
      item.atid = "";
    });

    this.props.onUpdateData(data);

    this.setState(
      {
        transactions: this.getTransactionsToShow(),
        items: this.getItemsToShow(),
      },
      this.handleOpSelectClick(e, "")
    );
  };

  handleCheckOutCartButtonClick = (e) => {
    let data = Object.assign({}, this.props.data);
    const itemsToCheckOut = this.state.items.filter(
      (item) => item.tableData?.checked
    );
    let newTransactions = [];
    itemsToCheckOut.forEach((item) => {
      let newAtid = (
        Math.max(
          ...data.transactions.concat(newTransactions).map((t) => t.tid)
        ) + 1
      ).toString();
      newTransactions.push({
        tid: newAtid,
        uid: this.props.selectedUser.uid,
        iid: item.iid,
        checkedOutDate: new Date().getTime(),
        dueDate: null,
        checkedInDate: "",
      });
    });

    this.setState({ newTransactions, isCheckoutModalOpen: true });
  };

  handleConfirmCheckOutButtonClick = (e) => {
    if (this.state.newTransactions.some((transaction) => !transaction.dueDate))
      return;

    let data = Object.assign({}, this.props.data);
    data.transactions = data.transactions.concat(this.state.newTransactions);
    this.state.newTransactions.forEach(
      (transaction) =>
        (data.items.find((item) => item.iid === transaction.iid).atid =
          transaction.tid)
    );

    this.props.onUpdateData(data);
    this.setState(
      {
        transactions: this.getTransactionsToShow(data.transactions),
        items: this.getItemsToShow(),
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
        (transaction) => transaction.iid === iid
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
      { title: "Item Name", field: "name" },
      { title: "Category", field: "category" },
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
                (transaction) => rowData.iid === transaction.iid
              ).dueDate
            }
            variant="inline"
            inputVariant="outlined"
            label="Select due date"
            format="MM/dd/yyyy"
            value={
              this.state.newTransactions.find(
                (transaction) => rowData.iid === transaction.iid
              ).dueDate
                ? new Date(
                    this.state.newTransactions.find(
                      (transaction) => rowData.iid === transaction.iid
                    ).dueDate
                  )
                : null
            }
            InputAdornmentProps={{ position: "end" }}
            onChange={(date) => handleDateChange(date, rowData.iid)}
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
              console.log(rowData);
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

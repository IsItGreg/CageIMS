import React, { Component } from "react";
import { Input, Button, Icon, Form, Tab } from "semantic-ui-react";
import { Container, Col, Row, Modal } from "react-bootstrap";
import Table from "../common/Table";

class CheckInOut extends Component {
  constructor(props) {
    super(props);
    this.handleSearchResult = this.handleSearchResult.bind(this);
    this.handleTransactionsChanges = this.handleDataChanges.bind(this);
    this.state = {
      error: false,
      userFound: {
        fname: "Greg",
        lname: "Smelkov",
        uid: "12345",
        courses: ["Photography I", "Photography II"],
      },
    };
  }

  handleSearchResult(userFound) {
    console.log(userFound);
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

  handleClick = () => {
    const users = this.props.users.filter(
      (user) => user.uid === this.state.searchInput
    );
    if (users.length > 0) {
      this.props.onSuccessfulSearchResult(users[0]);
    } else {
      this.setState({ error: true });
    }
  };

  render() {
    const isError = this.state.error;
    return (
      <div className="checkinout-search">
        <Input
          error={this.state.error}
          onChange={this.handleChange}
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
        <Button size="big" animated onClick={this.handleClick}>
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
      open: false,

      selectedItemId: null,
      selectedItem: {},

      selectedItemsToReturn: [],

      transactions: [],
      items: [],
    };
  }

  getTransactionsToShow = () => {
    let transactions = Array.from(
      this.props.data.transactions.filter(
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

  getItemsToShow = () => {
    let items = Array.from(
      this.props.data.items.filter(
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

  handleReturnClick = () => {
    this.setState({ op: "" });
  };

  handleOpSelectClick = (e, op) => {
    this.state.transactions.forEach((transaction) => {
      if (transaction.tableData) transaction.tableData.checked = false;
    });
    this.state.items.forEach((item) => {
      if (item.tableData) item.tableData.checked = false;
    });
    this.setState({ op: op });
  };

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

  handleRowItemClick = (e, rowData) => {
    if (this.state.op === "checkin") {
      let transactions = this.state.transactions;
      const index = transactions.indexOf(rowData);
      transactions[index].tableData.checked = !transactions[index].tableData
        .checked;
      this.setState({ transactions });
    } else if (this.state.op === "checkout") {
      let items = this.state.items;
      const index = items.indexOf(rowData);
      items[index].tableData.checked = !items[index].tableData.checked;
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
    itemsToCheckOut.forEach((item) => {
      let newAtid = (
        Math.max(...data.transactions.map((t) => t.tid)) + 1
      ).toString();
      data.transactions.push({
        tid: newAtid,
        uid: this.props.selectedUser.uid,
        iid: item.iid,
        checkedOutDate: new Date().getTime(),
        dueDate: new Date().getTime() + 1000 * 60 * 60 * 24 * 2, //temp; adds two days to today
        checkedInDate: "",
      });
      item.atid = newAtid;
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

    let itemPanes = [
      {
        menuItem: "All",
        render: () => (
          <Table
            data={this.state.items}
            columns={itemsColumnSet}
            title={<h3>All</h3>}
            onRowClick={(event, rowData) =>
              this.handleRowItemClick(event, rowData)
            }
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
            columns={itemsColumnSet}
            title={<h3>{category}</h3>}
            onRowClick={(event, rowData) =>
              this.handleRowItemClick(event, rowData)
            }
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
            data={this.state.items.filter((item) => item.tableData?.checked)}
            columns={cartColumnSet}
            title={<h3>Cart</h3>}
            onRowClick={(event, rowData) =>
              this.handleRowItemClick(event, rowData)
            }
            options={{ selection: true }}
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
              <Button.Content visible>Check In/Return</Button.Content>
            </Button>
            <Button
              onClick={(e) => {
                this.handleOpSelectClick(e, "checkout");
              }}
              color="blue"
              size="big"
            >
              <Button.Content visible>Check Out/Borrow</Button.Content>
            </Button>
          </Row>
        </div>
      );
    }

    return pageOp;
  }
}

import React, { Component } from "react";
import { Input, Button, Icon, Form } from "semantic-ui-react";
import { Container, Col, Row, Modal } from "react-bootstrap";
import Table from "../common/Table";

class CheckInOut extends Component {
  constructor(props) {
    super(props);
    this.handleSearchResult = this.handleSearchResult.bind(this);
    this.handleTransactionsChanges = this.handleTransactionsChanges.bind(this);
    this.state = {
      error: false,
      userFound: "",

      users: [
        {
          fname: "Seamus",
          lname: "Rioux",
          uid: "54321",
        },
        {
          fname: "Greg",
          lname: "Smelkov",
          uid: "12345",
        },
      ],

      transactions: [
        {
          fname: "Seamus",
          lname: "Rioux",
          uid: "54321",
          iid: "1",
          name: "Canon 5D Mk II",
          category: "Camera",
          serial: "125",
          notes: "Missing lens cap",
          checkedOutDate: "7/22/2020",
          checkedInDate: "7/24/2020",
          dueDate: "7/26/2020",
        },
        {
          fname: "Greg",
          lname: "Smelkov",
          uid: "12345",
          iid: "2",
          name: "Canon Eos",
          category: "Camera",
          serial: "124",
          notes: "Missing SD Card cover, otherwise works fine",
          checkedOutDate: "7/20/2020",
          checkedInDate: "",
          dueDate: "7/23/2020",
          backgroundColor: "mistyrose",
        },
        {
          fname: "Greg",
          lname: "Smelkov",
          uid: "12345",
          iid: "3",
          name: "Canon Eos 2",
          category: "Camera",
          serial: "124",
          notes: "Missing SD Card cover, otherwise works fine",
          checkedOutDate: "7/20/2020",
          checkedInDate: "",
          dueDate: "7/23/2020",
        },
        {
          fname: "Greg",
          lname: "Smelkov",
          uid: "12345",
          iid: "4",
          name: "Canon Eos 3",
          category: "Camera",
          serial: "124",
          notes: "Missing SD Card cover, otherwise works fine",
          checkedOutDate: "7/20/2020",
          checkedInDate: "",
          dueDate: "7/23/2020",
        },
      ],
    };
  }

  handleSearchResult(userFound) {
    this.setState({ userFound });
  }

  handleTransactionsChanges(transactions) {
    this.setState({ transactions });
  }

  render() {
    const userFound = this.state.userFound;
    let page;
    if (!userFound)
      page = (
        <Search
          users={this.state.users}
          onSuccessfulSearchResult={this.handleSearchResult}
        />
      );
    else
      page = (
        <CheckInOutViewUser
          onDoneClick={this.handleSearchResult}
          selectedUid={this.state.userFound}
          transactions={this.state.transactions}
          onUpdateTransactions={this.handleTransactionsChanges}
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
    const validIds = this.props.users.map((user) => user.uid);
    if (validIds.includes(this.state.searchInput)) {
      this.props.onSuccessfulSearchResult(this.state.searchInput);
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

      currentlyHeldColumnSet: [
        { title: "Item Name", field: "name" },
        { title: "Category", field: "category" },
        { title: "Serial", field: "serial" },
        { title: "Notes", field: "notes" },
        { title: "Checked Out", field: "checkedOutDate" },
        { title: "Due Date", field: "dueDate" },
      ],
      open: false,

      selectedItemId: null,
      selectedItem: {
        fname: "",
        lname: "",
        name: "",
        category: "",
        serial: "",
        notes: "",
        checkedOutDate: "",
        checkedInDate: "",
        dueDate: "",
      },

      selectedItemsToReturn: [],
    };
  }

  handleDoneClick = () => {
    this.props.onDoneClick("");
  };

  handleReturnClick = () => {
    this.setState({ op: "" });
  };

  handleOpSelectClick = (e, op) => {
    let newTransactions = Array.from(this.props.transactions);
    this.props.transactions.forEach((item) => {
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
    this.setState({
      selectedItemId: rowData.tableData.id,
      selectedItem: this.state.dataSet[rowData.tableData.id],
    });
  };

  handleReturnSelectedItemsClick = (e, transactions) => {
    const returnedItemIds = transactions
      .filter((item) => item.tableData?.checked)
      .map((item) => item.iid);
    const newTransactions = Array.from(this.props.transactions).filter(
      (item) => !returnedItemIds.includes(item.iid)
    );

    this.props.onUpdateTransactions(newTransactions);
    this.handleOpSelectClick(e, "");
  };

  render() {
    const users = { "12345": "Greg Smelkov", "54321": "Seamus Rioux" };

    const selectedItemId = this.state.selectedItemId;
    const selectedItem = this.state.selectedItem;

    let transactions = this.props.transactions.filter(
      (item) => item.uid == this.props.selectedUid
    );

    let pageOp;
    if (this.state.op === "checkin") {
      pageOp = (
        <div className="checkinout-viewuser">
          <Row className="page-menu">
            <h2>{users[this.props.userFound]} -- Check In/Return</h2>
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
                data={transactions}
                columns={this.state.currentlyHeldColumnSet}
                title={<h3>Currently held items:</h3>}
                onRowClick={(event, rowData) =>
                  this.handleRowItemClick(event, rowData)
                }
                options={{ selection: true }}
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
                this.handleReturnSelectedItemsClick(e, transactions);
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
            <h2>{users[this.props.userFound]} -- Check Out/Borrow</h2>
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
            <h4>Items due for Return:</h4>
            <div className="checkout-table-wrapper">
              <div className="checkout-inv-table"> Data Table </div>
              <div className="checkout-cart-table"> Cart Table </div>
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
                this.handleOpSelectClick(e, "");
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
            <h1>{users[this.props.userFound]}</h1>
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
                data={transactions}
                columns={this.state.currentlyHeldColumnSet}
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

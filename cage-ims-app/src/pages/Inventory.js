import React, { Component } from "react";
import {
  Divider,
  Button,
  Form,
  Dropdown,
  Icon,
  Tab,
  Menu,
} from "semantic-ui-react";
import { Col, Modal, Row } from "react-bootstrap";
import Table from "../common/Table";
import IconButton from "@material-ui/core/IconButton";
import ClearIcon from "@material-ui/icons/Clear";

class Inventory extends Component {
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
        {
          title: "Item Name",
          field: "name",
          headerStyle: headerStyleGrey,
        },
        {
          title: "Brand",
          field: "brand",
          headerStyle: headerStyleGrey,
        },
        {
          title: "Category",
          field: "category",
          headerStyle: headerStyleGrey,
        },
        {
          title: "Item ID",
          field: "iid",
          defaultSort: "asc",
          headerStyle: headerStyleGrey,
        },
        {
          title: "Serial",
          field: "serial",
          headerStyle: headerStyleGrey,
        },
        {
          title: "Notes",
          field: "notes",
          headerStyle: headerStyleGrey,
          render: (rowData) => {
            return rowData.notes ? (
              <Icon
                size="large"
                name="check circle"
                className="notes-icon"
              ></Icon>
            ) : null;
          },
        },
        {
          title: "Courses",
          field: "courses",
          headerStyle: headerStyleGrey,
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
        {
          title: "Expected Return Date",
          field: "expected",
          headerStyle: headerStyleGrey,
          render: (rowData) =>
            rowData.expected ? this.formatDate(rowData.expected) : "Available",
          customFilterAndSearch: (term, rowData) =>
            this.formatDateForSearchBar(rowData.expected).indexOf(term) !==
              -1 || this.formatDate(rowData.expected).indexOf(term) !== -1,
        },
      ],

      activeItem: "item",
      open: false,

      nameError: false,
      categoryError: false,
      iidError: false,
      serialError: false,
      editable: true,
      isChangesMadeToModal: false,
      isItemIdUnavailable: false,

      selectedItemId: null,
      selectedItem: {
        name: "",
        iid: "",
        serial: "",
        category: "",
        notes: "",
        atid: "",
        courses: [],
        expected: "",
        creationDate: "",
        transactions: [],
      },
    };
  }

  close = () =>
    this.setState({
      selectedItemId: null,
      nameError: false,
      categoryError: false,
      serialError: false,
      editable: true,
      submitName: "Close",
      submitIcon: null,
      isChangesMadeToModal: false,
      isItemIdUnavailable: false,
    });

  handleChange = (e, userProp) => {
    let val = e.target.value;
    if (userProp === "iid") {
      val = this.handleItemIdVerify(val);
    }
    this.setState((prevState) => {
      let selectedItem = Object.assign({}, prevState.selectedItem);
      selectedItem[userProp] = val;
      return { selectedItem, isChangesMadeToModal: true };
    });
  };

  handleItemSelectClick = (e, rowData) => {
    let selectedItemId = rowData.tableData.id;
    let selectedItem = Object.assign(
      {},
      this.props.data.items.find((item) => item.iid === rowData.iid)
    );
    let transactions = Array.from(
      this.props.data.transactions.filter(
        (transaction) => transaction.iid === selectedItem.iid
      )
    );
    transactions.forEach((transaction) => {
      transaction.backgroundColor =
        !transaction.checkedInDate &&
        new Date(transaction.dueDate).getTime() < new Date().getTime()
          ? "mistyrose"
          : "";
    });
    selectedItem["transactions"] = transactions;
    this.setState({
      selectedItemId,
      selectedItem,
    });
  };

  handleItemAddClick = () => {
    this.setState({
      selectedItemId: -1,
      selectedItem: {
        name: "",
        iid: this.generateInitialNextItemId(),
        serial: "",
        category: "",
        notes: "",
        atid: "",
        courses: [],
        creationDate: new Date().getTime(),
        expected: "",
        transactions: [],
      },
      editable: false,
      isChangesMadeToModal: false,
    });
  };

  handleItemEditClick = () => {
    !this.state.isChangesMadeToModal &&
      this.setState({
        editable: !this.state.editable,
      });
  };

  checkErrorUpdateDataSet = () => {
    if (
      !this.state.nameError &&
      !this.state.categoryError &&
      !this.state.serialError &&
      !this.state.isItemIdUnavailable &&
      !this.state.iidError
    ) {
      let data = Object.assign({}, this.props.data);
      if (this.state.selectedItemId >= 0) {
        data.items[this.state.selectedItemId] = this.state.selectedItem;
      } else {
        data.items.push(this.state.selectedItem);
      }
      this.props.onUpdateData(data);
      this.close();
    }
  };

  handleSubmitClick = () => {
    if (this.state.isChangesMadeToModal) {
      this.setState(
        {
          nameError: this.state.selectedItem.name === "",
          categoryError: this.state.selectedItem.category === "",
          iidError: this.state.selectedItem.iid === "",
          serialError: this.state.selectedItem.serial === "",
        },
        this.checkErrorUpdateDataSet
      );
    } else {
      this.close();
    }
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
    return (
      monthNames[date.getMonth()] +
      " " +
      date.getDate() +
      " " +
      date.getFullYear()
    );
  };

  formatItemDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString(
      [],
      ("en-US",
      {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    );
  };

  handleCourseDropdownChange = (e, { value }) => {
    const val = value;
    this.setState((prevState) => {
      let selectedItem = Object.assign({}, prevState.selectedItem);
      selectedItem.courses = val;
      return { selectedItem, isChangesMadeToModal: true };
    });
  };

  handleBrandDropdownChange = (e, { value }) => {
    const val = value;
    this.setState((prevState) => {
      let selectedItem = Object.assign({}, prevState.selectedItem);
      selectedItem.brand = val;
      return { selectedItem, isChangesMadeToModal: true };
    });
  };

  handleCategoryDropdownChange = (e, { value }) => {
    const val = value;
    this.setState((prevState) => {
      let selectedItem = Object.assign({}, prevState.selectedItem);
      selectedItem.category = val;
      return { selectedItem, isChangesMadeToModal: true };
    });
  };

  handleItemIdVerify = (iid) => {
    if (iid === "") return "";
    if (isNaN(iid)) {
      this.setState({ isItemIdUnavailable: true });
      return iid;
    }
    let fullID = "0".repeat(4 - iid.length) + iid;
    this.setState({
      isItemIdUnavailable: this.props.data.items.some(
        (item, i) => item.iid === fullID && this.state.selectedItemId !== i
      ),
    });
    return fullID;
  };

  generateInitialNextItemId = () => {
    if (this.props.data.items.length === 0) return "0001";
    const ids = this.props.data.items
      .map((item) => parseInt(item.iid))
      .sort((a, b) => a - b);
    const newId = (ids.find((id) => !ids.includes(id + 1)) + 1).toString();
    return "0".repeat(4 - newId.length) + newId;
  };

  handleItemClick = (e, { name }) => this.setState({ activeItem: name });

  render() {
    const selectedItemId = this.state.selectedItemId;
    const selectedItem = this.state.selectedItem;
    let formTablePanes = [];

    let items = Array.from(this.props.data.items);
    items.forEach((items) => {
      let result = this.props.data.transactions.filter(
        (transaction) => items.atid === transaction.tid
      );
      items.expected = !(items.atid === "") ? result[0].dueDate : "";
      items.backgroundColor = !(items.atid === "") ? "mistyrose" : "";
    });

    if (this.state.selectedItem != null && this.state.selectedItemId >= 0) {
      formTablePanes = [
        {
          menuItem: "Active",
          render: () => (
            <Table
              title={<h5>{this.state.selectedItem.name}</h5>}
              columns={[
                { title: "User ID", field: "uid" },
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
                this.state.selectedItem.transactions.filter(
                  (name) => name.checkedInDate === ""
                )
              )}
            ></Table>
          ),
        },
        {
          menuItem: "Completed",
          render: () => (
            <Table
              title={<h5>{this.state.selectedItem.name}</h5>}
              columns={[
                { title: "User ID", field: "uid" },
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
                this.state.selectedItem.transactions.filter(
                  (name) => !(name.checkedInDate === "")
                )
              )}
            ></Table>
          ),
        },
      ];
    }
    const inventoryTablePanes = [
      {
        menuItem: "All",
        render: () => (
          <Table
            data={Array.from(this.props.data.items)}
            columns={this.state.columnSet}
            title={<h2>Inventory</h2>}
            onRowClick={(event, rowData) =>
              this.handleItemSelectClick(event, rowData)
            }
          />
        ),
      },
      {
        menuItem: "Available",
        render: () => (
          <Table
            data={Array.from(
              this.props.data.items.filter(
                (name) => name.backgroundColor !== "mistyrose"
              )
            )}
            columns={this.state.columnSet}
            title={<h2>Inventory</h2>}
            onRowClick={(event, rowData) =>
              this.handleItemSelectClick(event, rowData)
            }
          />
        ),
      },
      {
        menuItem: "Unavailable",
        render: () => (
          <Table
            data={Array.from(
              this.props.data.items.filter(
                (name) => name.backgroundColor === "mistyrose"
              )
            )}
            columns={this.state.columnSet}
            title={<h2>Inventory</h2>}
            onRowClick={(event, rowData) =>
              this.handleItemSelectClick(event, rowData)
            }
          />
        ),
      },
    ];

    const courseOptions = Array.from(
      new Set(
        [].concat.apply(
          [],
          [
            this.state.selectedItem,
            ...this.props.data.items,
            ...this.props.data.users,
          ]
            .filter((item) => item.courses)
            .map((item) => item.courses)
        )
      )
    )
      .sort()
      .map((item) => ({ text: item, value: item }));
    const brandOptions = Array.from(
      new Set(
        [this.state.selectedItem, ...this.props.data.items]
          .filter((item) => item.brand)
          .map((item) => item.brand)
      )
    )
      .sort()
      .map((item) => ({ text: item, value: item }));
    const categoryOptions = Array.from(
      new Set(
        [this.state.selectedItem, ...this.props.data.items]
          .filter((item) => item.category)
          .map((item) => item.category)
      )
    )
      .sort()
      .map((item) => ({ text: item, value: item }));

    return (
      <Col className="stretch-h flex-col">
        <div className="top-bar">
          <Row>
            <Col>
              <Button
                className="float-down"
                style={{ backgroundColor: "#46C88C", color: "white" }}
                onClick={this.handleItemAddClick}
              >
                Create New Item
              </Button>
            </Col>
            <Col>
              <h1>Inventory</h1>
            </Col>
            <Col />
          </Row>
          <Divider clearing />
        </div>
        <div className="page-content stretch-h">
          <Col className="stretch-h flex-shrink flex-col">
            <Tab panes={inventoryTablePanes} className="stretch-h flex-col" />
            <Modal centered show={selectedItemId != null} onHide={this.close}>
              <Modal.Header bsPrefix="modal-header">
                <Modal.Title>Item</Modal.Title>
                <IconButton onClick={this.close} size="small" color="inherit">
                  <ClearIcon />
                </IconButton>
              </Modal.Header>
              <Modal.Body>
                {this.state.activeItem === "item" && (
                  <Form>
                    <Form.Field>
                      <label>
                        Name:
                        {this.state.nameError && (
                          <span className="error-text modal-label-error-text">
                            Error: Field is empty.
                          </span>
                        )}
                      </label>
                      <Form.Input
                        error={this.state.nameError}
                        name="name"
                        placeholder="Name"
                        defaultValue={selectedItem.name}
                        onChange={(e) => {
                          this.handleChange(e, "name");
                        }}
                        readOnly={this.state.editable}
                      ></Form.Input>
                    </Form.Field>
                    <Form.Group widths="equal">
                      <Form.Field>
                        <label>
                          Item ID:
                          {(this.state.iidError && (
                            <span className="error-text modal-label-error-text">
                              Error: Field is empty.
                            </span>
                          )) ||
                            (this.state.isItemIdUnavailable && (
                              <span className="error-text modal-label-error-text">
                                Error: Item ID is Taken
                              </span>
                            ))}
                          {}
                        </label>
                        <Form.Input
                          name="iid"
                          error={
                            this.state.iidError ||
                            this.state.isItemIdUnavailable
                          }
                          maxLength="4"
                          placeholder="Item ID"
                          defaultValue={selectedItem.iid}
                          onChange={(e) => {
                            this.handleChange(e, "iid");
                          }}
                          readOnly={this.state.editable}
                        ></Form.Input>
                      </Form.Field>
                      <Form.Field>
                        <label>
                          Serial ID:
                          {this.state.serialError && (
                            <span className="error-text modal-label-error-text">
                              Error: Field is empty.
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
                          readOnly={this.state.editable}
                        ></Form.Input>
                      </Form.Field>
                    </Form.Group>
                    <Form.Group widths="equal">
                      <Form.Field>
                        <label>Brand:</label>
                        <Dropdown
                          placeholder="Brand"
                          name="brand"
                          fluid
                          search
                          selection
                          allowAdditions
                          clearable
                          options={brandOptions}
                          value={selectedItem.brand}
                          onChange={this.handleBrandDropdownChange}
                          disabled={this.state.editable}
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>
                          Category:
                          {this.state.categoryError && (
                            <span className="error-text modal-label-error-text">
                              Error: Field cannot be empty.
                            </span>
                          )}
                        </label>
                        <Dropdown
                          placeholder="Category"
                          name="category"
                          fluid
                          error={this.state.categoryError}
                          search
                          selection
                          allowAdditions
                          options={categoryOptions}
                          value={selectedItem.category}
                          onChange={this.handleCategoryDropdownChange}
                          disabled={this.state.editable}
                        />
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
                        value={selectedItem.courses}
                        onChange={this.handleCourseDropdownChange}
                        disabled={this.state.editable}
                      />
                    </Form.Field>
                    <Form.Field>
                      <label>Notes:</label>
                      <Form.Input
                        name="notes"
                        error={this.state.notesError}
                        placeholder="Notes"
                        defaultValue={selectedItem.notes}
                        onChange={(e) => {
                          this.handleChange(e, "notes");
                        }}
                        readOnly={this.state.editable}
                      ></Form.Input>
                    </Form.Field>
                    <Form.Group widths="equal">
                      {this.state.selectedItemId >= 0 ? (
                        <Form.Field>
                          <label>Date Created:</label>
                          <Form.Input
                            name="creationDate"
                            placeholder="creationDate"
                            defaultValue={this.formatItemDate(
                              selectedItem.creationDate
                            )}
                            readOnly
                          ></Form.Input>
                        </Form.Field>
                      ) : null}
                      {this.state.selectedItem.expected && (
                        <Form.Field>
                          <label>Expected Return Date:</label>
                          <Form.Input
                            name="expected"
                            placeholder="Expected"
                            defaultValue={this.formatDate(
                              selectedItem.expected
                            )}
                            readOnly
                          ></Form.Input>
                        </Form.Field>
                      )}
                    </Form.Group>
                  </Form>
                )}
                {this.state.activeItem === "table" &&
                  this.state.selectedItemId >= 0 && (
                    <Tab
                      panes={formTablePanes}
                      className="stretch-h flex-col"
                    />
                  )}
              </Modal.Body>
              <Modal.Footer>
                {this.state.selectedItemId >= 0 ? (
                  <Button
                    className="btn btn-primary mr-auto"
                    toggle
                    active={!this.state.editable}
                    onClick={this.handleItemEditClick}
                  >
                    <Icon name="pencil" />
                    Edit
                  </Button>
                ) : null}
                {this.state.selectedItemId >= 0 && (
                  <Menu compact className="mr-auto">
                    <Menu.Item
                      name="item"
                      active={this.state.activeItem === "item"}
                      onClick={this.handleItemClick}
                    >
                      <Icon name="clipboard list" />
                      Item Form
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
                  id="add-icon-handler ml-auto"
                  variant="primary"
                  onClick={this.handleSubmitClick}
                >
                  {this.state.isChangesMadeToModal ? (
                    <Icon name="save"></Icon>
                  ) : null}
                  {this.state.isChangesMadeToModal ? "Save" : "Close"}
                </Button>
              </Modal.Footer>
            </Modal>
          </Col>
        </div>
      </Col>
    );
  }
}

export default Inventory;

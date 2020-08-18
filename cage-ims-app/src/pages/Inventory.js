import React, { Component } from "react";
import { Divider, Button, Form, Dropdown, Icon, Tab } from "semantic-ui-react";
import { Col, Row, Modal } from "react-bootstrap";
import Table from "../common/Table";

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
          title: "Availablity",
          field: "atid",
          headerStyle: headerStyleGrey,
          render: (rowData) => {
            return rowData.atid === "" ? "Available" : "Unavailable";
          },
        },
        {
          title: "Notes",
          field: "notes",
          headerStyle: headerStyleGrey,
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
          render: (rowData) => this.formatDate(rowData.expected),
          customFilterAndSearch: (term, rowData) =>
            this.formatDateForSearchBar(rowData.expected).indexOf(term) !==
              -1 || this.formatDate(rowData.expected).indexOf(term) !== -1,
        },
      ],
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

  handleUserSelectClick = (e, rowData) => {
    this.setState({
      selectedItemId: rowData.tableData.id,
      selectedItem: this.props.data.items[rowData.tableData.id],
    });
  };

  handleAddUserClick = () => {
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
      },
      editable: false,
      isChangesMadeToModal: false,
    });
  };

  handleUserEditClick = () => {
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
    if (!this.state.isChangesMadeToModal) {
      this.close();
      return;
    }
    this.setState(
      {
        nameError: this.state.selectedItem.name === "",
        categoryError: this.state.selectedItem.category === "",
        iidError: this.state.selectedItem.iid === "",
        serialError: this.state.selectedItem.serial === "",
      },
      this.checkErrorUpdateDataSet
    );
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
    if (this.props.data.items.length === 0) return "0000";
    const ids = this.props.data.items
      .map((item) => parseInt(item.iid))
      .sort((a, b) => a - b);
    const newId = (ids.find((id) => !ids.includes(id + 1)) + 1).toString();
    return "0".repeat(4 - newId.length) + newId;
  };

  render() {
    const selectedItemId = this.state.selectedItemId;
    const selectedItem = this.state.selectedItem;

    let items = Array.from(this.props.data.items);
    items.forEach((items) => {
      let result = this.props.data.transactions.filter(
        (transaction) => items.atid === transaction.tid
      );
      items.expected = !(items.atid === "") ? result[0].dueDate : "";
      items.backgroundColor = !(items.atid === "") ? "mistyrose" : "";
    });

    const inventoryTablePanes = [
      {
        menuItem: "All",
        render: () => (
          <Table
            data={Array.from(this.props.data.items)}
            columns={this.state.columnSet}
            title={<h2>Inventory</h2>}
            onRowClick={(event, rowData) =>
              this.handleUserSelectClick(event, rowData)
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
              this.handleUserSelectClick(event, rowData)
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
              this.handleUserSelectClick(event, rowData)
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
          <Button basic onClick={this.handleAddUserClick}>
            Create New Item
          </Button>
          <Divider clearing />
        </div>
        <div className="page-content stretch-h">
          <Col className="stretch-h flex-col">
            <Tab panes={inventoryTablePanes} className="stretch-h flex-col" />
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
                          Name:
                          {this.state.nameError && (
                            <span className="error-text modal-label-error-text">
                              Error: Field cannot be empty.
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
                        <label>
                          Item ID:
                          {(this.state.iidError && (
                            <span className="error-text modal-label-error-text">
                              Error: Field cannot be empty.
                            </span>
                          )) ||
                            (this.state.isItemIdUnavailable && (
                              <span className="error-text modal-label-error-text">
                                Error: Item ID is Taken or Incorrect
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
                          readOnly={this.state.editable}
                        ></Form.Input>
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
                      {!(this.state.selectedItem.expected === "") ? (
                        <div>
                          <Form.Field>
                            <label>Transaction ID:</label>
                            <Form.Input
                              name="atid"
                              placeholder="Transaction ID"
                              defaultValue={selectedItem.atid}
                              readOnly
                            ></Form.Input>
                          </Form.Field>
                          <Form.Field>
                            <label>Expected Return Date:</label>
                            <Form.Input
                              name="expected"
                              placeholder="Expected Return Date"
                              defaultValue={this.formatDate(
                                selectedItem.expected
                              )}
                              readOnly
                            ></Form.Input>
                          </Form.Field>
                        </div>
                      ) : null}
                    </Form>
                  </Col>
                </Row>
              </Modal.Body>
              <Modal.Footer>
                {this.state.selectedItemId >= 0 ? (
                  <Button
                    className="btn btn-primary mr-auto"
                    toggle
                    active={!this.state.editable}
                    onClick={this.handleUserEditClick}
                  >
                    <Icon name="pencil" />
                    Edit
                  </Button>
                ) : null}
                <Button
                  id="add-icon-handler"
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

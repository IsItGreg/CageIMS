import React, { Component } from "react";
import { Divider, Button, Form, Dropdown, Icon } from "semantic-ui-react";
import { Col, Row, Modal } from "react-bootstrap";
import Table from "../common/Table";

class Inventory extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      columnSet: [
        { title: "Name", field: "name" },
        { title: "Category", field: "category" },
        { title: "Item ID", field: "iid" },
        {
          title: "Availablity",
          field: "atid",
          render: (rowData) => {
            return rowData.atid === "" ? "Available" : "Unavailable";
          },
        },
        { title: "Notes", field: "notes" },
        {
          title: "Courses",
          field: "courses",
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
          render: (rowData) => this.formatDate(rowData.expected),
        },
      ],
      open: false,

      nameError: false,
      categoryError: false,
      serialError: false,
      editable: true,

      selectedItemId: null,
      selectedItem: {
        name: "",
        iid: "",
        category: "",
        notes: "",
        atid: "",
        courses: [],
        expected: "",
      },
      courseOptions: [
        { text: "Photography I", value: "Photography I" },
        { text: "Photography II", value: "Photography II" },
        { text: "Documentary Image", value: "Documentary Image" },
      ],
    };
  }

  close = () =>
    this.setState({
      selectedItemId: null,
      nameError: false,
      categoryError: false,
      serialError: false,
      editable: true,
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
      selectedItemId: rowData.tableData.id,
      selectedItem: this.props.data.items[rowData.tableData.id],
    });
  };

  handleAddUserClick = () => {
    this.setState({
      selectedItemId: -1,
      selectedItem: {
        name: "",
        iid: "",
        category: "",
        notes: "",
        atid: "",
        courses: [],
        expected: "",
      },
      editable: false,
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
      !this.state.serialError
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
    this.setState(
      {
        nameError: this.state.selectedItem.name === "",
        categoryError: this.state.selectedItem.category === "",
        serialError: this.state.selectedItem.serial === "",
      },
      this.checkErrorUpdateDataSet
    );
  };

  handleDropdownAddition = (e, { value }) => {
    this.setState((prevState) => ({
      courseOptions: [{ text: value, value }, ...prevState.courseOptions],
    }));
  };

  formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return (
      date.getMonth() + 1 + "/" + date.getDate() + "/" + date.getFullYear()
    );
  };

  handleDropdownChange = (e, { value }) => {
    const val = value;
    this.setState((prevState) => {
      let selectedItem = Object.assign({}, prevState.selectedItem);
      selectedItem.courses = val;
      return { selectedItem };
    });
  };

  render() {
    const selectedItemId = this.state.selectedItemId;
    const selectedItem = this.state.selectedItem;

    let editButton;
    let expetedDateField;
    let tidField;

    let items = Array.from(this.props.data.items);
    items.forEach((items) => {
      let result = this.props.data.transactions.filter(
        (transaction) => items.atid === transaction.tid
      );
      console.log(result);
      items.expected = !(items.atid === "") ? result[0].dueDate : "";
      items.backgroundColor = !(items.atid === "") ? "mistyrose" : "";
    });

    if (this.state.selectedItemId != null) {
      if (this.state.selectedItemId >= 0) {
        if (!(this.state.selectedItem.expected === "")) {
          expetedDateField = (
            <Form.Field>
              <label>Expected Return Date:</label>
              <Form.Input
                name="expected"
                placeholder="Expected Return Date"
                defaultValue={this.formatDate(selectedItem.expected)}
                readOnly
              ></Form.Input>
            </Form.Field>
          );
          tidField = (
            <Form.Field>
              <label>Transaction ID:</label>
              <Form.Input
                name="atid"
                placeholder="Transaction ID"
                defaultValue={selectedItem.atid}
                readOnly
              ></Form.Input>
            </Form.Field>
          );
        }
        editButton = (
          <Button
            className="btn btn-primary mr-auto"
            toggle
            active={!this.state.editable}
            onClick={this.handleUserEditClick}
          >
            <Icon name="pencil" />
            Edit
          </Button>
        );
      }
    }

    const courseOptions = this.state.courseOptions;
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
            <Table
              data={Array.from(this.props.data.items)}
              columns={this.state.columnSet}
              title={<h2>Inventory</h2>}
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
                        <label>
                          Category:
                          {this.state.categoryError && (
                            <span className="error-text modal-label-error-text">
                              Error: Field cannot be empty.
                            </span>
                          )}
                        </label>
                        <Form.Input
                          error={this.state.categoryError}
                          name="category"
                          placeholder="Category"
                          defaultValue={selectedItem.category}
                          onChange={(e) => {
                            this.handleChange(e, "category");
                          }}
                          readOnly={this.state.editable}
                        ></Form.Input>
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
                          onAddItem={this.handleDropdownAddition}
                          onChange={this.handleDropdownChange}
                          disabled={this.state.editable}
                        />
                      </Form.Field>
                      <Form.Field>
                        <label>
                          Item ID:
                          {this.state.serialError && (
                            <span className="error-text modal-label-error-text">
                              Error: Field cannot be empty.
                            </span>
                          )}
                        </label>
                        <Form.Input
                          name="iid"
                          error={this.state.serialError}
                          placeholder="Item ID"
                          defaultValue={selectedItem.iid}
                          onChange={(e) => {
                            this.handleChange(e, "iid");
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
                      {tidField}
                      {expetedDateField}
                    </Form>
                  </Col>
                </Row>
              </Modal.Body>
              <Modal.Footer>
                {editButton}
                <Button
                  id="add-icon-handler"
                  variant="primary"
                  onClick={this.handleSubmitClick}
                >
                  <Icon name="save" />
                  Submit
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

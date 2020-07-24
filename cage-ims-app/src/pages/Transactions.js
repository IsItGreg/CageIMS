import React, { Component } from "react";
import { Divider, Button, Form, Dropdown, Tab } from "semantic-ui-react";
import { Col, Row, Modal } from "react-bootstrap";
import Table from "../common/Table";

class Transactions extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      dataSet: [
        {
          fname: "Seamus",
          lname: "Rioux",
          name: "Canon 5D Mk II",
          category: "Camera",
          serial: "125",
          notes: "Missing lens cap",
        },
        {
          fname: "Greg",
          lname: "Smelkov",
          name: "Canon Eos",
          category: "Camera",
          serial: "124",
          notes: "Missing SD Card cover, otherwise works fine",
        },
      ],
      columnSet: [
        { title: "First Name", field: "fname" },
        { title: "Last Name", field: "lname" },
        { title: "Item Name", field: "name" },
        { title: "Category", field: "category" },
        { title: "Serial", field: "serial" },
        { title: "Notes", field: "notes" },
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
      selectedItemId: rowData.tableData.id,
      selectedItem: this.state.dataSet[rowData.tableData.id],
    });
  };

  handleAddUserClick = () => {
    this.setState({
      selectedItemId: -1,
      selectedItem: {
        fname: "",
        lname: "",
        name: "",
        category: "",
        serial: "",
        notes: "",
      },
    });
  };

  checkErrorUpdateDataSet = () => {
    if (
      !this.state.nameError &&
      !this.state.categoryError &&
      !this.state.serialError &&
      !this.state.notesError
    ) {
      this.setState((prevState) => {
        let dataSet = Array.from(prevState.dataSet);
        if (this.state.selectedItemId >= 0) {
          dataSet[this.state.selectedItemId] = this.state.selectedItem;
        } else {
          dataSet.push(this.state.selectedItem);
        }
        return { dataSet };
      }, this.close);
    }
  };

  handleSubmitClick = () => {
    this.setState(
      {
        nameError: this.state.selectedItem.name === "",
        categoryError: this.state.selectedItem.category === "",
        serialError: this.state.selectedItem.serial === "",
        notesError: this.state.selectedItem.notes === "",
      },
      this.checkErrorUpdateDataSet
    );
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

  render() {
    const selectedItemId = this.state.selectedItemId;
    const selectedItem = this.state.selectedItem;

    const courseOptions = this.state.courseOptions;
    return (
      <div className="page-content stretch-h">
        <Col className="stretch-h flex-col">
          <div className="topbar">
            <Button basic onClick={this.handleAddUserClick}>
              Create New Item
            </Button>
            <Divider clearing />
          </div>
          <Table
            data={Array.from(this.state.dataSet)}
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
                        onChange={(e) => {
                          this.handleChange(e, "fname");
                        }}
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
                        name="name"
                        placeholder="Last Name"
                        defaultValue={selectedItem.lname}
                        onChange={(e) => {
                          this.handleChange(e, "lname");
                        }}
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
                        onChange={(e) => {
                          this.handleChange(e, "name");
                        }}
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
                        onChange={(e) => {
                          this.handleChange(e, "category");
                        }}
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
                      ></Form.Input>
                    </Form.Field>
                  </Form>
                </Col>
              </Row>
            </Modal.Body>
            <Modal.Footer>
              <Button
                id="add-icon-handler"
                variant="primary"
                onClick={this.handleSubmitClick}
              >
                Submit
              </Button>
            </Modal.Footer>
          </Modal>
        </Col>
      </div>
    );
  }
}

export default Transactions;

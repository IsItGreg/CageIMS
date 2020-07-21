import React, { Component, setState } from "react";
import { Divider, Button, Input, Form } from "semantic-ui-react";
import { Modal, Col } from "react-bootstrap";
import Table from "../common/Table";

class Inventory extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      columnSet: [
        { title: "Name", field: "name" },
        { title: "Category", field: "category" },
        { title: "UML Serial", field: "serial" },
        { title: "Notes", field: "notes" },
        { title: "Courses", field: "courses" },
      ],
      dataSet: [
        {
          name: "Canon 5D MK II",
          category: "Camera",
          serial: "125",
          notes: "Missing Lens Cap",
          courses: ["Photography I", "Photography II"],
        },
        {
          name: "Canon EOS",
          category: "Camera",
          serial: "124",
          notes: "Missing SD Card Cover",
          courses: "Photography II",
        },
      ],
      open: false,
      selectedUserId: null,
      selectedUser: null,
    };
  }
  close = () => this.setState({ selectedUserId: null, selectedUser: null });

  handleChange = (e, userProp) => {
    const val = e.target.value;
    this.setState((prevState) => {
      let selectedUser = Object.assign({}, prevState.selectedUser);
      selectedUser[userProp] = val;
      return { selectedUser };
    });
  };

  handleUserSelectClick = (e, rowData) => {
    this.setState({
      selectedUserId: rowData.tableData.id,
      selectedUser: this.state.dataSet[rowData.tableData.id],
    });
  };

  handleAddUserClick = () => {
    this.setState({ selectedUserId: -1 });
  };

  handleSubmitClick = () => {
    this.setState((prevState) => {
      let dataSet = Array.from(prevState.dataSet);
      if (this.state.selectedUserId >= 0) {
        dataSet[this.state.selectedUserId] = this.state.selectedUser;
      } else {
        dataSet.push(this.state.selectedUser);
      }
      return { dataSet };
    });

    this.close();
  };

  render() {
    const selectedUserId = this.state.selectedUserId;
    const selectedUser = this.state.selectedUser ?? {
      name: "",
      category: "",
      id: "",
      notes: "",
      courses: "",
    };
    return (
      <div className="userspage">
        <Col>
          <Button basic onClick={this.handleAddUserClick}>
            {" "}
            Create New Item{" "}
          </Button>
          <Divider clearing />
          <Modal centered show={selectedUserId != null} onHide={this.close}>
            <Modal.Header closeButton bsPrefix="modal-header">
              <Modal.Title>
                {this.state.selectedUserId >= 0
                  ? "Edit Item"
                  : "Create New Item"}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Field>
                  <label>Name</label>
                  <Form.Input
                    type="name"
                    placeholder="Name"
                    defaultValue={selectedUser.name}
                    onChange={(e) => {
                      this.handleChange(e, "name");
                    }}
                  ></Form.Input>
                </Form.Field>
                <Form.Field>
                  <label>Category</label>
                  <Form.Input
                    type="category"
                    placeholder="Category"
                    defaultValue={selectedUser.category}
                    onChange={(e) => {
                      this.handleChange(e, "category");
                    }}
                  ></Form.Input>
                </Form.Field>
                <Form.Field>
                  <label>UML Serial</label>
                  <Form.Input
                    type="serial"
                    placeholder="UML Serial"
                    defaultValue={selectedUser.serial}
                    onChange={(e) => {
                      this.handleChange(e, "serial");
                    }}
                  ></Form.Input>{" "}
                  {/* TODO: change input type to searchable multiselect dropdown */}
                </Form.Field>
                <Form.Field>
                  <label>Notes</label>
                  <Form.Input
                    type="notes"
                    placeholder="Notes"
                    defaultValue={selectedUser.notes}
                    onChange={(e) => {
                      this.handleChange(e, "notes");
                    }}
                  ></Form.Input>
                </Form.Field>
                <Form.Field>
                  <label>Courses</label>
                  <Form.Input
                    type="courses"
                    placeholder="Courses"
                    defaultValue={selectedUser.courses}
                    onChange={(e) => {
                      this.handleChange(e, "courses");
                    }}
                  ></Form.Input>
                </Form.Field>
              </Form>
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
          <Table
            data={Array.from(this.state.dataSet)}
            columns={this.state.columnSet}
            title={<h2>Inventory</h2>}
            onRowClick={(event, rowData) =>
              this.handleUserSelectClick(event, rowData)
            }
          ></Table>
        </Col>
      </div>
    );
  }
}

export default Inventory;

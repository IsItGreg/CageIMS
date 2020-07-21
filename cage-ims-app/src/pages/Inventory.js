import React, { Component } from "react";
import { Tabs, Tab, Col } from "react-bootstrap";
import { Divider, Button } from "semantic-ui-react";
import Table from "../common/Table";

class Inventory extends Component {
  render() {
    return (
      <div>
        <Col className="userspage">
          <Button basic>Add Item</Button>
          <Divider clearing />
          <Tabs defaultActiveKey="all" id="uncontrolled-tab-example">
            <Tab eventKey="all" title="All">
              <Table
                data={this.dataSet}
                columns={this.columnSet}
                title={<h2>Inventory</h2>}
              ></Table>
            </Tab>
            <Tab eventKey="available" title="Available">
              <Table
                data={this.dataSet}
                columns={this.columnSet}
                title={<h2>Inventory</h2>}
              ></Table>
            </Tab>
            <Tab eventKey="usnavailable" title="Unavailable">
              <Table
                data={this.dataSet}
                columns={this.columnSet}
                title={<h2>Inventory</h2>}
              ></Table>
            </Tab>
          </Tabs>
        </Col>
      </div>
    );
  }
  columnSet = [
    { title: "Name", field: "name" },
    { title: "Category", field: "category" },
    { title: "UML Serial", field: "serial" },
    { title: "Notes", field: "notes" },
    { title: "Courses", field: "course" },
  ];
  dataSet = [
    {
      name: "Canon 5D MK II",
      category: "Camera",
      serial: "125",
      notes: "Missing Lens Cap",
      course: "Photography I Photography II",
    },
    {
      name: "Canon EOS",
      category: "Camera",
      serial: "124",
      notes: "Missing SD Card Cover",
      course: "Photography II",
    },
  ];
}

export default Inventory;

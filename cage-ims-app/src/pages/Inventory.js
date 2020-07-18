import React, { Component } from "react";
import { Tabs, Tab } from "react-bootstrap";
import { Divider, Segment, Button } from "semantic-ui-react";
import Table from "../common/Table";

class Inventory extends Component {
  render() {
    return (
      <div className="userspage">
        <Segment>
          <Button basic>Add Item</Button>
          <Divider clearing />
          <h1>Inventory</h1>
          <Tabs defaultActiveKey="all" id="uncontrolled-tab-example">
            <Tab eventKey="all" title="All">
              <Table data={this.dataSet} columns={this.columnSet}></Table>
            </Tab>
            <Tab eventKey="available" title="Available">
              <Table data={this.dataSet} columns={this.columnSet}></Table>
            </Tab>
            <Tab eventKey="usnavailable" title="Unavailable">
              <Table data={this.dataSet} columns={this.columnSet}></Table>
            </Tab>
          </Tabs>
        </Segment>
      </div>
    );
  }
  columnSet = [
    { title: "Name" },
    { title: "Category" },
    { title: "UML Serial" },
    { title: "Notes" },
    { title: "Courses" },
  ];
  dataSet = [
    [
      "Canon 5D MK II",
      "Camera",
      "125",
      "Missing Lens Cap",
      "Photography I Photography II",
    ],
    ["Canon EOS", "Camera", "124", "Missing SD Card Cover", "Photography II"],
  ];
}

export default Inventory;

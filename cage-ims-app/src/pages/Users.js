import React, { Component } from "react";
import { Divider, Segment, Button } from "semantic-ui-react";
import { Modal } from "bootstrap";
import Table from "../common/Table";

class Users extends Component {
  render() {
    return (
      <div className="userspage">
        <Segment>
          <Button basic>Add User</Button>
          <Divider clearing />
          <h1>Users</h1>
          <Table data={this.dataSet} columns={this.columnSet}></Table>
        </Segment>
      </div>
    );
  }

  columnSet = [
    { title: "First Name" },
    { title: "Last Name" },
    { title: "Course" },
  ];
  dataSet = [
    ["Seamus", "Rioux", "Photography I Photography II"],
    ["Greg", "Smelkov", "Photography I"],
  ];
}

export default Users;

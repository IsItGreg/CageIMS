import React, { Component } from "react";
import Table from "../common/Table";

class Users extends Component {
  render() {
    return (
      <div className="userspage">
        <h1>Users</h1>
        <Table data={this.dataSet} columns={this.columnSet}></Table>
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

import React, { Component } from "react";
import { Divider, Button, Icon } from "semantic-ui-react";
import { Col, Row } from "react-bootstrap";
import Table from "../common/Table";

class Courses extends Component {
  constructor(props) {
    super(props);
    this.state = {
      courseList: [],
    };
  }

  // getCourseList(){
  //     this.props.data.items.forEach(element => {
  //         element.courses

  //     });
  // }
  render() {
    const courseOptions = Array.from(
      new Set(
        [].concat.apply(
          [],
          [...this.props.data.items, ...this.props.data.users]
            .filter((item) => item.courses)
            .map((item) => item.courses)
        )
      )
    )
      .sort()
      .map((item) => ({
        cname: item,
        enroll: Array.from(
          this.props.data.users.filter((b) => b.courses.includes(item))
        ).length,
      }));

    const headerStyleGrey = {
      backgroundColor: "#E2E2E2",
      color: "black",
      fontSize: "24",
    };
    const columnSet = [
      {
        title: "Course Name",
        field: "cname",
        defaultSort: "asc",
        headerStyle: headerStyleGrey,
      },
      {
        title: "Currently Enrolled Students",
        field: "enroll",
        headerStyle: headerStyleGrey,
      },
      {
        title: "Active",
        field: "active",
        headerStyle: headerStyleGrey,
        render: (rowData) => {
          return rowData.enroll > 0 ? (
            <Icon
              size="large"
              name="check circle"
              className="notes-icon"
            ></Icon>
          ) : null;
        },
      },
    ];
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
                Create New Course
              </Button>
            </Col>
            <Col>
              <h1>Courses List</h1>
            </Col>
            <Col />
          </Row>
          <Divider clearing />
        </div>
        <div className="page-content stretch-h">
          <Col className="stretch-h flex-shrink flex-col">
            <Table
              data={courseOptions}
              columns={columnSet}
              title={<h2>Courses</h2>}
            />
          </Col>
        </div>
      </Col>
    );
  }
}

export default Courses;

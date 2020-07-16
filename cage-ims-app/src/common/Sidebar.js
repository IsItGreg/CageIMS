import React, { Component } from "react";
import {Icon,Button} from "semantic-ui-react"
import {Container,Row,Col,NavItem, Nav} from "react-bootstrap"


export class Sidebar extends Component {
  render() {
    const mystyle = {
      color: "white",
      fontFamily: "Roboto",
      fontSize: "large",
      background: "#93AAB8",
    };
    const sideBarColor = {
      background: "#93AAB8",
    };
    return (
      <Container fluid>
        <Row>
          <Nav style = {sideBarColor}>
              <Col>
                <NavItem> <Button  style = {mystyle} class="ui button"> <Icon name="home"/>Home </Button></NavItem>
                <NavItem> <Button  style = {mystyle} class="ui button"><Icon name="sync"/> Check In/Out </Button></NavItem>
                <NavItem> <Button  style = {mystyle} class="ui button"> <Icon name="users"/> Users </Button></NavItem>
                <NavItem><Button  style = {mystyle} class="ui button"> <Icon name="camera"/> Inventory </Button></NavItem>
                <NavItem><Button  style = {mystyle} class="ui button"> <Icon name="user"/> Staff </Button></NavItem>
                <NavItem><Button  style = {mystyle} class="ui button"> <Icon name="history"/>Transactions </Button></NavItem>
              </Col>
          </Nav>
          <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-md-4">
            <canvas class="my-4 w-100" id="myChart" width="100" height="380"></canvas>
        </main>
      </Row>
    </Container>
    );
  }
}



export default Sidebar;
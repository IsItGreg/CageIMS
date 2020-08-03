import React, { Component } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

import Header from "./common/Header";
import Sidebar from "./common/Sidebar";
import { Container, Row, Col } from "react-bootstrap";
import "./App.scss";
import CheckInOut from "./pages/CheckInOut";
import Users from "./pages/Users";
import Inventory from "./pages/Inventory";
import Staff from "./pages/Staff";
import Transactions from "./pages/Transactions";

class App extends Component {
  constructor(props) {
    super(props);
    // this.handleSearchResult = this.handleSearchResult.bind(this);
    // this.handleTransactionsChanges = this.handleTransactionsChanges.bind(this);
    this.handleDataUpdate = this.handleDataUpdate.bind(this);
    this.state = {
      data: {
        users: [
          {
            fname: "Seamus",
            lname: "Rioux",
            uid: "54321",
            email: "srioux@email.com",
            phone: "123-456-7890",
            notes: "Optional notes for Seamus",
          },
          {
            fname: "Greg",
            lname: "Smelkov",
            uid: "12345",
          },
        ],
        items: [
          {
            name: "Canon 5D Mk II",
            iid: "1",
            category: "Camera",
            notes: "",
            atid: "3",
          },
          {
            name: "Canon 18-55 F4.0",
            iid: "2",
            category: "Lens",
            notes: "Missing lens cap",
            atid: "4",
          },
        ],
        transactions: [
          {
            tid: "1",
            uid: "54321",
            iid: "1",
            checkedOutDate: "7/22/2020",
            dueDate: "7/26/2020",
            checkedInDate: "7/24/2020",
          },
          {
            tid: "2",
            uid: "54321",
            iid: "2",
            checkedOutDate: "7/22/2020",
            dueDate: "7/26/2020",
            checkedInDate: "7/24/2020",
          },
          {
            tid: "3",
            uid: "12345",
            iid: "1",
            checkedOutDate: "7/25/2020",
            dueDate: "7/27/2020",
            checkedInDate: "",
            background: "mistyrose",
          },
          {
            tid: "4",
            uid: "12345",
            iid: "2",
            checkedOutDate: "7/25/2020",
            dueDate: "7/27/2020",
            checkedInDate: "",
            background: "mistyrose",
          },
        ],
      },
    };
  }

  handleDataUpdate(data) {
    this.setState({ data });
  }

  render() {
    return (
      <Router>
        <Container fluid className="no-gutters flex-col stretch-hw">
          <Header />
          <Row className="flex-grow no-gutters">
            <Col md="auto" className="no-gutters">
              <Sidebar />
            </Col>
            <Col className="no-gutters">
              <Switch>
                <Route exact path="/">
                  Home
                </Route>
                <Route path="/checkinout">
                  <CheckInOut
                    data={this.state.data}
                    onUpdateData={this.handleDataUpdate}
                  />
                </Route>
                <Route path="/users">
                  <Users onUpdateData={this.handleDataUpdate} />
                </Route>
                <Route path="/inventory">
                  <Inventory onUpdateData={this.handleDataUpdate} />
                </Route>
                <Route path="/staff">
                  <Staff onUpdateData={this.handleDataUpdate} />
                </Route>
                <Route path="/transactions">
                  <Transactions onUpdateData={this.handleDataUpdate} />
                </Route>
              </Switch>
            </Col>
          </Row>
        </Container>
      </Router>
    );
  }
}

export default App;

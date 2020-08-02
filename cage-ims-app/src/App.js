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
    this.state = {
      error: false,
      userFound: "",
      data: {
        users: [
          {
            fname: "Seamus",
            lname: "Rioux",
            uid: "54321",
          },
          {
            fname: "Greg",
            lname: "Smelkov",
            uid: "12345",
          },
        ],

        transactions: [
          {
            fname: "Seamus",
            lname: "Rioux",
            uid: "54321",
            iid: "1",
            name: "Canon 5D Mk II",
            category: "Camera",
            serial: "125",
            notes: "Missing lens cap",
            checkedOutDate: "7/22/2020",
            checkedInDate: "7/24/2020",
            dueDate: "7/26/2020",
          },
          {
            fname: "Greg",
            lname: "Smelkov",
            uid: "12345",
            iid: "2",
            name: "Canon Eos",
            category: "Camera",
            serial: "124",
            notes: "Missing SD Card cover, otherwise works fine",
            checkedOutDate: "7/20/2020",
            checkedInDate: "",
            dueDate: "7/23/2020",
            backgroundColor: "mistyrose",
          },
          {
            fname: "Greg",
            lname: "Smelkov",
            uid: "12345",
            iid: "3",
            name: "Canon Eos 2",
            category: "Camera",
            serial: "124",
            notes: "Missing SD Card cover, otherwise works fine",
            checkedOutDate: "7/20/2020",
            checkedInDate: "",
            dueDate: "7/23/2020",
          },
          {
            fname: "Greg",
            lname: "Smelkov",
            uid: "12345",
            iid: "4",
            name: "Canon Eos 3",
            category: "Camera",
            serial: "124",
            notes: "Missing SD Card cover, otherwise works fine",
            checkedOutDate: "7/20/2020",
            checkedInDate: "",
            dueDate: "7/23/2020",
          },
        ],
      },
    };
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
                  <CheckInOut />
                </Route>
                <Route path="/users">
                  <Users />
                </Route>
                <Route path="/inventory">
                  <Inventory />
                </Route>
                <Route path="/staff">
                  <Staff />
                </Route>
                <Route path="/transactions">
                  <Transactions />
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

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

class App extends Component {
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
                <Route path="/transactions">Transactions</Route>
              </Switch>
            </Col>
          </Row>
        </Container>
      </Router>
    );
  }
}

export default App;

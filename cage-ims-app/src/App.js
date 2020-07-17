import React, { Component } from "react";
import { HashRouter as Router, Route, Link, Switch } from "react-router-dom";

import Header from "./common/Header";
import Sidebar from "./common/Sidebar";
import Users from "./pages/Users";
import Inventory from "./pages/Inventory";
import { Container, Row } from "react-bootstrap";
import "./App.scss";

class App extends Component {
  render() {
    return (
      <Router>
        <Container fluid className="no-gutters flex-col stretch-hw">
          <Header />
          <Row className="flex-fill">
            <Sidebar />
            <Switch>
              <Route exact path="/">
                Home
              </Route>
              <Route path="/checkinout">Check In / Out</Route>
              <Route path="/users">
                <Users></Users>
              </Route>
              <Route path="/inventory">
                <Inventory></Inventory>
              </Route>
              <Route path="/staff">Staff</Route>
              <Route path="/transactions">Transactions</Route>
            </Switch>
          </Row>
        </Container>
      </Router>
    );
  }
}

export default App;

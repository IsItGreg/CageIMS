import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
import Header from "./common/Header";
import Sidebar from "./common/Sidebar";

class App extends Component {
  render() {
    return (
      <Router>
        <Header />
        {/* <Sidebar /> */}

        <Switch>
          <Route exact path="/">
            Home
          </Route>
          <Route path="/checkinout">Check In / Out</Route>
          <Route path="/users">Users</Route>
          <Route path="/inventory">Inventory</Route>
          <Route path="/staff">Staff</Route>
          <Route path="/transactions">Transactions</Route>
        </Switch>
      </Router>
    );
  }
}

export default App;

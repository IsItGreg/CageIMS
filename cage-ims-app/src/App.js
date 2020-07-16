import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
import Header from "./common/Header";
import MySidebar from "./common/Sidebar";

class App extends Component {
  render() {
    return (
      <Router>
        <Header />
        <MySidebar />
      </Router>
    );
  }
}

export default App;

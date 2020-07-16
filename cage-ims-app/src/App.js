import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import logo from "./logo.svg";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";

import { Sidebar } from "./common/Sidebar";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="container">
          <h2>Test React App</h2>
        </div>
        <Sidebar />
      </Router>
    );
  }
}

export default App;

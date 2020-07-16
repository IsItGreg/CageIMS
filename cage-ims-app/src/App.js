import React, { Component } from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
import Header from "./common/Header";
import Sidebar from "./common/Sidebar";

import { Sidebar } from "./common/Sidebar";

class App extends Component {
  render() {
    return (
      <Router>
        <Header />
        {/* <Sidebar /> */}

        <div className="container">
          <h2>Test React App</h2>
        </div>
        <Sidebar />
      </Router>
    );
  }
}

export default App;

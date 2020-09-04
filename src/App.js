import React, { Component } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import Header from "./common/Header";
import Sidebar from "./common/Sidebar";
import Login from "./pages/Login";
import { Container, Row, Col } from "react-bootstrap";
import "./App.scss";
import CheckInOut from "./pages/CheckInOut";
import Users from "./pages/Users";
import Inventory from "./pages/Inventory";
import Staff from "./pages/Staff";
import Transactions from "./pages/Transactions";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

class App extends Component {
  constructor(props) {
    super(props);
    this.handleDataUpdate = this.handleDataUpdate.bind(this);
    this.handleActiveUserUpdate = this.handleActiveUserUpdate.bind(this);
    //this.handleLoginUpdate = this.handleLoginUpdate.bind(this);
    this.state = {
      loggedIn: true,
      visible: true,
      data: {
        users: [
          {
            fname: "User",
            lname: "AWhoExists",
            uid: "11111111",
            email: "existing@email.com",
            phone: "123-456-7891",
            notes: "Optional notes for Seamus",
            creationDate: new Date().getTime(),
            courses: ["PreviousCourse"],
          },
          {
            fname: "Seamus",
            lname: "Rioux",
            uid: "54321",
            email: "srioux@email.com",
            phone: "123-456-7891",
            notes: "Optional notes for Seamus",
            creationDate: new Date().getTime(),
            courses: ["Photography I"],
          },
          {
            fname: "Greg",
            lname: "Smelkov",
            uid: "12345",
            email: "greg@email.com",
            phone: "123-456-7891",
            notes: "Optional notes for Greg",
            creationDate: new Date().getTime(),
            courses: ["Photography I", "Photography II"],
          },
        ],
        items: [
          {
            name: "Canon 5D Mk II",
            iid: "0001",
            brand: "Canon",
            serial: "123456",
            category: "Camera",
            notes: "",
            atid: "3",
            courses: ["Photography II"],
            creationDate: new Date().getTime(),
          },
          {
            name: "Canon 18-55 F4.0",
            iid: "0002",
            brand: "Canon",
            serial: "223456",
            category: "Lens",
            notes: "Missing lens cap",
            atid: "4",
            courses: ["Photography I", "Photography II"],
            creationDate: new Date().getTime(),
          },
          {
            name: "Mavic Drone",
            iid: "0003",
            brand: "Mavic",
            serial: "323456",
            category: "Other",
            notes: "Goes whirrr",
            atid: "",
            courses: ["Photography I", "Photography II"],
            creationDate: new Date().getTime(),
          },
          {
            name: "Canon 5D Mk II",
            iid: "0004",
            brand: "Canon",
            serial: "423456",
            category: "Camera",
            notes: "",
            atid: "",
            courses: ["Photography II"],
            creationDate: new Date().getTime(),
          },
          {
            name: "Canon 18-55 F4.0",
            iid: "0005",
            brand: "Canon",
            serial: "523456",
            category: "Lens",
            notes: "Missing lens cap",
            atid: "",
            courses: ["Photography I", "Photography II"],
            creationDate: new Date().getTime(),
          },
        ],
        transactions: [
          {
            tid: "1",
            uid: "54321",
            iid: "0001",
            checkedOutDate: new Date("7/22/2020").getTime(),
            dueDate: new Date("7/26/2020").getTime(),
            checkedInDate: new Date("7/24/2020").getTime(),
            notes: "Example of transaction notes",
          },
          {
            tid: "2",
            uid: "54321",
            iid: "0002",
            checkedOutDate: new Date("7/22/2020").getTime(),
            dueDate: new Date("7/26/2020").getTime(),
            checkedInDate: new Date("7/24/2020").getTime(),
            notes: "Example of transaction notes",
          },
          {
            tid: "3",
            uid: "12345",
            iid: "0001",
            checkedOutDate: new Date("7/25/2020").getTime(),
            dueDate: new Date("7/28/2020").getTime(),
            checkedInDate: "",
            notes: "Example of transaction notes",
          },
          {
            tid: "4",
            uid: "12345",
            iid: "0002",
            checkedOutDate: new Date("7/25/2020").getTime(),
            dueDate: new Date("7/27/2020").getTime(),
            checkedInDate: "",
            notes: "Example of transaction notes",
          },
        ],
      },
      activeUser: {},
    };
  }

  handleDataUpdate(data) {
    this.setState({ data });
    // console.log("Data Updated", data);
  }

  handleActiveUserUpdate(activeUser) {
    console.log(activeUser);
    this.setState({ activeUser });
  }

  render() {
    return (
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <Router>
          <Switch>
            <Route exact path="/login">
              <Login onUpdateActiveUser={this.handleActiveUserUpdate} />
            </Route>
            <Container fluid className="no-gutters flex-col stretch-hw">
              <Header />
              <Row className="flex-grow no-gutters">
                <Col md="auto" className="no-gutters">
                  <Sidebar />
                </Col>
                <Col className="no-gutters">
                  <Switch>
                    <Route exact path="/">
                      <CheckInOut
                        data={this.state.data}
                        onUpdateData={this.handleDataUpdate}
                      />
                    </Route>
                    <Route path="/users">
                      <Users
                        data={this.state.data}
                        onUpdateData={this.handleDataUpdate}
                      />
                    </Route>
                    <Route path="/inventory">
                      <Inventory
                        data={this.state.data}
                        onUpdateData={this.handleDataUpdate}
                      />
                    </Route>
                    <Route path="/staff">
                      <Staff onUpdateData={this.handleDataUpdate} />
                    </Route>
                    <Route path="/transactions">
                      <Transactions
                        data={this.state.data}
                        onUpdateData={this.handleDataUpdate}
                      />
                    </Route>
                  </Switch>
                </Col>
              </Row>
            </Container>
          </Switch>
        </Router>
      </MuiPickersUtilsProvider>
    );
  }
}

export default App;

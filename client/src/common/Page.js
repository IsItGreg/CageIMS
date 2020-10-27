import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import { Row, Col, Container } from "react-bootstrap";
import CheckInOut from "../pages/CheckInOut";
import Users from "../pages/Users";
import Inventory from "../pages/Inventory";
import Staff from "../pages/Staff";
import Transactions from "../pages/Transactions";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { connect } from "react-redux";

class Page extends Component {
    constructor(props) {
        super(props);
        this.handleDataUpdate = this.handleDataUpdate.bind(this);
        this.state = {
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
        };
    }

    handleDataUpdate(data) {
        this.setState({ data });
        // console.log("Data Updated", data);
    }

    render() {
        return (
            <Container fluid className="no-gutters flex-col stretch-hw">
                <Header activeUser={this.state.activeUser} />
                <Row className="flex-grow no-gutters" style={{overflow: "hidden"}}>
                    <Col md="auto" className="no-gutters">
                        <Sidebar />
                    </Col>
                    <Col className="no-gutters stretch-h">
                        <Switch>
                            <Route exact path="/">
                                <CheckInOut
                                    data={this.state.data}
                                    onUpdateData={this.handleDataUpdate}
                                />
                            </Route>
                            <Route path="/users">
                                <Users />
                            </Route>
                            <Route path="/inventory">
                                <Inventory/>
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
        )
    }
}

Page.propTypes = {
};
const mapStateToProps = state => ({
});
export default connect(
    mapStateToProps
)(Page);
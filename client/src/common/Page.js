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
    }

    render() {
        return (
            <Container fluid className="no-gutters flex-col stretch-hw">
                <Header />
                <Row className="flex-grow no-gutters" style={{overflow: "hidden"}}>
                    <Col md="auto" className="no-gutters">
                        <Sidebar />
                    </Col>
                    <Col className="no-gutters stretch-h">
                        <Switch>
                            <Route exact path="/">
                                <CheckInOut />
                            </Route>
                            <Route path="/users">
                                <Users />
                            </Route>
                            <Route path="/inventory">
                                <Inventory/>
                            </Route>
                            {/* <Route path="/staff">
                                { <Staff onUpdateData={this.handleDataUpdate} /> }
                            </Route> */}
                            <Route path="/transactions">
                                <Transactions />
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

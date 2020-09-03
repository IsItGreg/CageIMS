import React, { Component } from "react";
import { Col, Row } from "react-bootstrap";
import { Button, Form } from "semantic-ui-react";

export default class Login extends Component {
  constructor(props) {
    super(props);
    //this.handleLogin = this.handleLogin.bind(this);
    this.state = {
      curDay: new Date()
        .toLocaleString(
          [],
          ("en-US",
          {
            month: "short",
            day: "numeric",
          })
        )
        .split(",")
        .join("\t"),
      curTime: new Date()
        .toLocaleString(
          [],
          ("en-US",
          {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          })
        )
        .split(",")
        .join("\t"),
    };
  }

  componentDidMount() {
    this.setState({
      clockIntervalId: setInterval(() => {
        this.setState({
          curDay: new Date()
            .toLocaleString(
              [],
              ("en-US",
              {
                month: "short",
                day: "numeric",
              })
            )
            .split(",")
            .join("\t"),
          curTime: new Date()
            .toLocaleString(
              [],
              ("en-US",
              {
                hour: "numeric",
                minute: "2-digit",
                hour12: true,
              })
            )
            .split(",")
            .join("\t"),
        });
      }, 1000),
    });
  }

  componentWillUnmount() {
    clearInterval(this.state.clockIntervalId);
  }

  render() {
    return (
      <Row className="stretch-h">
        <Col className="login-page-left ">
          <div className="vertical-center">
            <h2>Today, {this.state.curDay}</h2>
            <div className="line" />
            <h1>{this.state.curTime}</h1>
          </div>
        </Col>
        <Col className="login-page-right">
          <div className="vertical-center-right">
            <Form>
              <h1>Log in</h1>
              <Form.Field>
                <label>Username</label>
                <Form.Input placeholder="Username" className="drop-shadow" />
              </Form.Field>
              <Form.Field>
                <label>Password</label>
                <Form.Input placeholder="Password" className="drop-shadow" />
              </Form.Field>
              <div>
                <Button className="button-right" size="medium" basic>
                  Forgot Password
                </Button>
                <Button
                  style={{ backgroundColor: "#46C88C", color: "white" }}
                  href="#/"
                  size="medium"
                >
                  Login
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    );
  }
}

import React, { Component } from "react";
import { Col, Row } from "react-bootstrap";
import { Button, Form } from "semantic-ui-react";
import axios from "axios";

export default class Login extends Component {
  constructor(props) {
    super(props);
    //this.handleLogin = this.handleLogin.bind(this);
    this.state = {
      visble: true,
      curTime: new Date()
        .toLocaleString(
          [],
          ("en-US",
          {
            weekday: "short",
            month: "short",
            day: "numeric",
            hour: "2-digit",
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
          curTime: new Date()
            .toLocaleString(
              [],
              ("en-US",
              {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "2-digit",
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

  submitLogin() {
    axios
      .get("/api/users/login")
      .then((user) => this.props.onUpdateActiveUser(user))
      .catch((err) => console.log(err));
  }

  render() {
    return (
      <Row className="stretch-h">
        <Col className="login-page-left ">
          <div className="vertical-center">
            <h1>{this.state.curTime}</h1>
          </div>
        </Col>
        <Col className="login-page-right">
          <div>
            <Form onSubmit={submitLogin}>
              <h1>Login</h1>
              <Form.Field>
                <label>Email</label>
                <Form.Input
                  onChange={this.setState({ email: e.target.value })}
                  placeholder="Email"
                  className="drop-shadow"
                />
              </Form.Field>
              <Form.Field>
                <label>Password</label>
                <Form.Input placeholder="Email" className="drop-shadow" />
              </Form.Field>
              <Form.Field>
                <Button basic>Forgot Password</Button>
              </Form.Field>
              <Form.Button content="Submit" />
              <Button
                style={{ backgroundColor: "#46C88C", color: "white" }}
                href="#/"
              >
                Login
              </Button>
            </Form>
          </div>
        </Col>
      </Row>
    );
  }
}

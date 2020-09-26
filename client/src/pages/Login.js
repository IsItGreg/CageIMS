import React, { Component } from "react";
import { Col, Row } from "react-bootstrap";
import { Button, Form } from "semantic-ui-react";
import axios from "axios";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
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
    console.log(this.state.email)
    console.log(this.state.password)
    // axios
    //   .post("/api/users/find", { email: this.state.email })
    //   .then(res => {
    //     if (res) {
    //       this.props.onUpdateActiveUser(res.data);
    //       window.location.href = '/#/';
    //     }
    //   })
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
            <Form onSubmit={() => { this.submitLogin() }}>
              <h1>Login</h1>
              <Form.Field>
                <label>Email</label>
                <Form.Input
                  onChange={(e) => { this.setState({ email: e.target.value }) }}
                  placeholder="Email"
                  className="drop-shadow"
                />
              </Form.Field>
              <Form.Field>
                <label>Password</label>
                <Form.Input
                  type='password'
                  onChange={(e) => { this.setState({ password: e.target.value }) }}
                  placeholder="Password"
                  className="drop-shadow"
                />
              </Form.Field>
              <Form.Field>
                <Button basic>Forgot Password</Button>
              </Form.Field>
              <Form.Button
                style={{ backgroundColor: "#46C88C", color: "white" }}
                content="Log In"
              />
            </Form>
          </div>
        </Col>
      </Row>
    );
  }
}

import React, { Component } from "react";
import { Col, Row } from "react-bootstrap";
import { Button, Form } from "semantic-ui-react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser } from "../actions/authActions";
import classnames from "classnames";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
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
    if (this.props.auth.isAuthenticated) {
      window.location.href = "/#/";
    }
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

  componentWillReceiveProps(nextProps) {
    if (nextProps.auth.isAuthenticated) {
      window.location.href = '/#/'; // push user to dashboard when they login
    }
    if (nextProps.errors) {
      this.setState({
        errors: nextProps.errors
      });
    }
  }

  submitLogin() {
    const userData = {
      email: this.state.email,
      password: this.state.password
    };
    this.props.loginUser(userData);
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
    const errors = this.state.errors;
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
                <span>{errors.email}{errors.emailnotfound}</span>
                <Form.Input
                  onChange={(e) => { this.setState({ email: e.target.value }) }}
                  placeholder="Email"
                  className={classnames("", {
                    invalid: errors.email || errors.emailnotfound
                  })}
                />
              </Form.Field>
              <Form.Field>
                <label>Password</label>
                <span>{errors.password}{errors.passwordincorrect}</span>
                <Form.Input
                  type='password'
                  onChange={(e) => { this.setState({ password: e.target.value }) }}
                  placeholder="Password"
                  className={classnames("", {
                    invalid: errors.password || errors.passwordincorrect
                  })}
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

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(
  mapStateToProps,
  { loginUser }
)(Login);
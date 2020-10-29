import React, { Component } from "react";
import { Col, Row, Modal } from "react-bootstrap";
import { Form } from "semantic-ui-react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { loginUser, forgotPassword } from "../actions/authActions";
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
  }

  openForgotPasswordModal(e) {
    e.preventDefault();
    this.setState({ showForgotPasswordModal: true });
  }

  resetPassword() {
    if (this.state.femail1 === this.state.femail2) {
      this.props.forgotPassword({ email: this.state.femail1 });
    }

    this.setState({ showForgotPasswordModal: false });
  }

  render() {
    const errors = this.state.errors;
    return (
      <Row className="stretch-h">
        <Col xs={6} className="login-page-left ">
          <h1>{this.state.curTime}</h1>
        </Col>
        <Col xs={6} className="login-page-right">
          <div className="centered-form">
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
              <Form.Button basic
                content="Forgot Password"
                className="button-right"
                onClick={(e) => { this.openForgotPasswordModal(e) }}
              />
              <Form.Button
                style={{ backgroundColor: "#46C88C", color: "white" }}
                className="button-center"
                content="Log In"
              />
            </Form>
          </div>
          <Modal
            centered
            show={this.state.showForgotPasswordModal}
            onHide={() => this.setState({ showForgotPasswordModal: false })}
          >
            <Modal.Header closeButton bsPrefix="modal-header">
              <Modal.Title>Reset Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Row>
                <Col>
                  <Form onSubmit={() => { this.resetPassword() }}>
                    <Form.Field>
                      <label>Email</label>
                      <Form.Input
                        onChange={(e) => { this.setState({ femail1: e.target.value }) }}
                        placeholder="Email"
                      />
                    </Form.Field>
                    <Form.Field>
                      <label>Confirm Email</label>
                      <Form.Input
                        onChange={(e) => { this.setState({ femail2: e.target.value }) }}
                        placeholder="Confirm Email"
                      />
                    </Form.Field>
                    <Form.Button
                      style={{ backgroundColor: "#46C88C", color: "white" }}
                      content="Reset Password"
                    />
                  </Form>
                </Col>
              </Row>
            </Modal.Body>
          </Modal>
        </Col>
      </Row>
    );
  }
}

Login.propTypes = {
  loginUser: PropTypes.func.isRequired,
  forgotPassword: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(
  mapStateToProps,
  { loginUser, forgotPassword }
)(Login);
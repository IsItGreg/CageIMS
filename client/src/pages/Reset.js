import React, { Component } from "react";
import { Col, Row } from "react-bootstrap";
import { Form } from "semantic-ui-react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { resetPassword } from "../actions/authActions";
import classnames from "classnames";

class Reset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      errors: {},
      password2: "",
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

  submitPassword() {
    console.log(this);
    const userData = {
      password: this.state.password,
      password2: this.state.password2,
      token: window.location.href.substring(window.location.href.lastIndexOf('/')+1)
    }
    console.log(window.location);
    console.log(userData);
    if (this.state.password === this.state.password2) {
      this.props.resetPassword(userData)
    }
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
            <Form onSubmit={() => { this.submitPassword() }}>
              <h1>Reset Password</h1>
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
                <label>Confirm Password</label>
                <span>{errors.password}{errors.passwordincorrect}</span>
                <Form.Input
                  type='password'
                  onChange={(e) => { this.setState({ password2: e.target.value }) }}
                  placeholder="Confirm Password"
                  className={classnames("", {
                    invalid: errors.password || errors.passwordincorrect
                  })}
                />
              </Form.Field>
              <Form.Button
                style={{ backgroundColor: "#46C88C", color: "white" }}
                content="Submit"
              />
            </Form>
          </div>
        </Col>
      </Row>
    );
  }
}

Reset.propTypes = {
  resetPassword: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};
const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors
});
export default connect(
  mapStateToProps,
  { resetPassword }
)(Reset);
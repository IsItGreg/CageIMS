import React, { Component } from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authActions";

import "./App.scss";

import PrivateRoute from "./common/PrivateRoute";
import Login from "./pages/Login";
import Page from "./common/Page";
import Reset from "./pages/Reset";

import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

import { Provider } from "react-redux";
import store from "./store";

// Check for token to keep user logged in
if (localStorage.jwtToken) {
  // Set auth token header auth
  const token = localStorage.jwtToken;
  setAuthToken(token);
  // Decode token and get user info and exp
  const decoded = jwt_decode(token);
  // Set user and isAuthenticated
  store.dispatch(setCurrentUser(decoded));
  // Check for expired token
  const currentTime = Date.now() / 1000; // to get in milliseconds
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    // Redirect to login
    window.location.href = "./login";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Router>
            <Switch>
              <Route exact path="/login">
                <Login onUpdateActiveUser={this.handleActiveUserUpdate} />
              </Route>
              <Route path="/reset">
                <Reset />
              </Route>
              <Route >
                <PrivateRoute component={Page} />
              </Route>
            </Switch>
          </Router>
        </MuiPickersUtilsProvider>
      </Provider>
    );
  }
}

export default App;

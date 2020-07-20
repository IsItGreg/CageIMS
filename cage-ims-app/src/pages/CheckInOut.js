import React, { Component, createRef } from "react";
import { HashRouter as Router, Route, Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { Input, Button, Icon } from "semantic-ui-react";

class CheckInOut extends Component {
  constructor(props) {
    super(props);
    this.handleSearchResult = this.handleSearchResult.bind(this);
    this.state = {
      error: false,
      userFound: "12345",
    };
  }

  handleSearchResult(userFound) {
    this.setState({ userFound });
  }

  render() {
    const userFound = this.state.userFound;
    let page;
    if (!userFound)
      page = <Search onSuccessfulSearchResult={this.handleSearchResult} />;
    else
      page = (
        <CheckInOutViewUser
          onDoneClick={this.handleSearchResult}
          userFound={this.state.userFound}
        />
      );
    return <Container className="checkinout">{page}</Container>;
  }
}

export default CheckInOut;

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      validIds: ["12345", "54321"],
    };
  }

  handleChange = (e) => {
    this.setState({ searchInput: e.target.value });
  };

  handleClick = () => {
    if (this.state.validIds.includes(this.state.searchInput)) {
      this.props.onSuccessfulSearchResult(this.state.searchInput);
    } else {
      this.setState({ error: true });
    }
  };

  render() {
    const isError = this.state.error;
    return (
      <div class="checkinout-search">
        <Input
          error={this.state.error}
          onChange={this.handleChange}
          size="huge"
          fluid
          icon="users"
          iconPosition="left"
          placeholder="Search by exact ID..."
        />
        {isError && (
          <div class="error-text">
            <p>Error: ID is invalid.</p>
          </div>
        )}
        <Button size="big" animated onClick={this.handleClick}>
          <Button.Content visible>Search</Button.Content>
          <Button.Content hidden>
            <Icon name="search" />
          </Button.Content>
        </Button>
      </div>
    );
  }
}

class CheckInOutViewUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      op: "",
    };
  }

  handleDoneClick = () => {
    this.props.onDoneClick("");
  };

  handleReturnClick = () => {
    this.state.op = "";
  };

  handleOpSelectClick = (e, op) => {
    this.setState({ op: op });
  };

  render() {
    const users = { "12345": "Greg Smelkov", "54321": "Seamus Rioux" };

    let pageOp;
    if (this.state.op === "checkin") {
      pageOp = (
        <div class="checkinout-viewuser">
          <Row className="page-menu">
            <h2>{users[this.props.userFound]} -- Check In/Return</h2>
            <Button
              onClick={(e) => {
                this.handleOpSelectClick(e, "");
              }}
              size="big"
              animated
              color="green"
            >
              <Button.Content visible>Back</Button.Content>
              <Button.Content hidden>
                <Icon name="arrow circle left" />
              </Button.Content>
            </Button>
          </Row>
          <Row>
            <h4>Items due for Return:</h4>
            <div class="current-table"> Data Table </div>
          </Row>
          <Row className="flex-end">
            <Button
              onClick={(e) => {
                this.handleOpSelectClick(e, "");
              }}
              color="red"
              size="big"
            >
              <Button.Content visible>Cancel</Button.Content>
            </Button>
            <Button
              onClick={(e) => {
                this.handleOpSelectClick(e, "");
              }}
              color="orange"
              size="big"
            >
              <Button.Content visible>Return Selected Items</Button.Content>
            </Button>
          </Row>
        </div>
      );
    } else if (this.state.op === "checkout") {
      pageOp = (
        <div class="checkinout-viewuser">
          <Row className="page-menu">
            <h2>{users[this.props.userFound]} -- Check Out/Borrow</h2>
            <Button
              onClick={(e) => {
                this.handleOpSelectClick(e, "");
              }}
              size="big"
              animated
              color="green"
            >
              <Button.Content visible>Back</Button.Content>
              <Button.Content hidden>
                <Icon name="arrow circle left" />
              </Button.Content>
            </Button>
          </Row>
          <Row>
            <h4>Items due for Return:</h4>
            <div class="checkout-table-wrapper">
              <div class="checkout-inv-table"> Data Table </div>
              <div class="checkout-cart-table"> Cart Table </div>
            </div>
          </Row>
          <Row className="flex-end">
            <Button
              onClick={(e) => {
                this.handleOpSelectClick(e, "");
              }}
              color="red"
              size="big"
            >
              <Button.Content visible>Cancel</Button.Content>
            </Button>
            <Button
              onClick={(e) => {
                this.handleOpSelectClick(e, "");
              }}
              color="blue"
              size="big"
            >
              <Button.Content visible>Check Out Selected Items</Button.Content>
            </Button>
          </Row>
        </div>
      );
    } else {
      pageOp = (
        <div class="checkinout-viewuser">
          <Row className="page-menu">
            <h2>{users[this.props.userFound]}</h2>
            <Button
              onClick={this.handleDoneClick}
              size="big"
              animated
              color="green"
            >
              <Button.Content visible>Complete Transactions</Button.Content>
              <Button.Content hidden>
                <Icon name="check" />
              </Button.Content>
            </Button>
          </Row>
          <Row>
            <h4>Currently held items:</h4>
            <div class="current-table"> Data Table </div>
          </Row>
          <Row className="checkinout-buttons">
            <Button
              onClick={(e) => {
                this.handleOpSelectClick(e, "checkin");
              }}
              color="orange"
              size="big"
            >
              <Button.Content visible>Check In/Return</Button.Content>
            </Button>
            <Button
              onClick={(e) => {
                this.handleOpSelectClick(e, "checkout");
              }}
              color="blue"
              size="big"
            >
              <Button.Content visible>Check Out/Borrow</Button.Content>
            </Button>
          </Row>
        </div>
      );
    }

    return pageOp;
  }
}

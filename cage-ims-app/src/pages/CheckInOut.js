import React, { Component, createRef } from "react";
import { HashRouter as Router, Route, Link } from "react-router-dom";
import { Container, Row, Col } from "react-bootstrap";
import { Input, Button, Icon } from "semantic-ui-react";

class CheckInOut extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
    };
  }

  inputRef = createRef();
  handleClick = () => {
    if (this.inputRef.current.inputRef.current.value != "12345") {
      this.state.error = true;
    }
  };
  render() {
    return (
      <Container className="checkinout">
        <div class="checkinout-search">
          <Input
            error={this.state.error}
            ref={this.inputRef}
            size="huge"
            fluid
            icon="users"
            iconPosition="left"
            placeholder="Search by exact ID..."
          />
          <Button animated onClick={this.handleClick}>
            <Button.Content visible>Search</Button.Content>
            <Button.Content hidden>
              <Icon name="search" />
            </Button.Content>
          </Button>
        </div>
      </Container>
    );
  }
}

export default CheckInOut;

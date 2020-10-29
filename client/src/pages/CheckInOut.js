import React, { Component } from "react";
import { Input, Button, Icon, Form, Tab } from "semantic-ui-react";
import { Container, Col, Row, Modal } from "react-bootstrap";
import Table from "../common/Table";
import { KeyboardDatePicker, DatePicker } from "@material-ui/pickers";
import IconButton from "@material-ui/core/IconButton";
import DateRange from "@material-ui/icons/DateRange";

import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getUserIfNeeded} from "../actions/userActions"
import CheckInOutViewUser from "../pages/CheckInOutViewUser"


//Main component page has user search bar
class CheckInOut extends Component {
  constructor(props) {
    super(props);
    this.handleSearchResult = this.handleSearchResult.bind(this);
    this.state = {
      error: false, //boolean error variable for when user is not found 
      userFound: null, //the user found by typing in id from database
      searchInput:"", //input recieved from search bar
      madeRequest:false, //variable for api call request made
    };
  }

  //Function that gets input from search bar
  handleChange = (e) => {
    this.setState({ searchInput: e.target.value });
  };

  componentWillReceiveProps(nextProps) {
    //if user is found by id in database
    if(nextProps.sentUser !== null && this.state.madeRequest == true ){
      console.log(nextProps.sentUser);
      this.setState({userFound:nextProps.sentUser})
    }
    //if no user matches id entered in search bar
    else if(this.state.madeRequest == true && nextProps.isGetting == false && nextProps.sentUser == null){
      this.setState({error:true})
      this.setState({madeRequest:false});
    }
  }

  //Function that handles the user clicking the search button
  handleSearchButtonClick = async () => {
    //api call to database
    const { dispatch } = this.props;
    dispatch(getUserIfNeeded(this.state.searchInput)); 
    this.setState({madeRequest:true,reset : false});
  };

  //Function that handles user pressing enter key
  handleKeyDown = (e) => {
    if (e.key === "Enter") {
      this.handleSearchButtonClick();
    }
  };

  handleSearchResult(userFound,clear) {
    this.setState({ userFound:null,searchInput:"" ,error: false,madeRequest:false});
  }

  render() {
    const userFound = this.state.userFound;
    let page;
    if (!userFound)
      page = (
        <div className="checkinout-search">
        <h1>Check In / Out</h1>
        <Input
          error={this.state.error}
          onChange={this.handleChange}
          onKeyPress={this.handleKeyDown}
          size="huge"
          fluid
          icon="users"
          iconPosition="left"
          placeholder="Search by exact ID..."
          className="drop-shadow"
        />
        {this.state.error && (
          <div className="error-text">
            <p>Error: ID is invalid.</p>
          </div>
        )}
        <Button
          size="big"
          positive
          basic
          animated
          onClick={this.handleSearchButtonClick}
        >
          <Button.Content visible>Search</Button.Content>
          <Button.Content hidden>
            <Icon name="search" />
          </Button.Content>
        </Button>
      </div>
      );
    else
      page = (
        <CheckInOutViewUser
          onDoneClick={this.handleSearchResult}
          selectedUser={this.state.userFound}
          onUpdateData={this.handleTransactionsChanges}
        />
      );
    return <Container className="checkinout">{page}</Container>;
  }
}

CheckInOut.propTypes = {
  getUsersIfNeeded: PropTypes.func.isRequired,
  getUser: PropTypes.func.isRequired,
  putUser: PropTypes.func.isRequired,
  postTransaction: PropTypes.func.isRequired,
  transactions: PropTypes.array.isRequired,
  items: PropTypes.array.isRequired,
  sentUser: PropTypes.object.isRequired,
  isGetting: PropTypes.bool.isRequired,
  lastUpdated: PropTypes.number,
  dispatch: PropTypes.func.isRequired
};
function mapStateToProps(state) {
  
  const { user,transaction,item } = state;
  const {transactions} = transaction;
  const {items} = item;
  const { isGetting, lastUpdated,sentUser} = user;
  return { isGetting, lastUpdated,sentUser,transactions,items };
}
export default connect(mapStateToProps)(CheckInOut);



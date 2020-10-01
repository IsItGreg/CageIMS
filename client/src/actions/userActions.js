import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { get } from "mongoose";

export const REQUEST_USERS = 'REQUEST_USERS'
export const RECEIVE_USERS = 'RECEIVE_USERS'
export const GET_ERRORS = 'GET_ERRORS'
export const UPDATE_USER = 'UPDATE_USER'

function getErrors(payload) {
    return {
        type: GET_ERRORS,
        payload
    }
}

function requestUsers() {
    return {
        type: REQUEST_USERS
    }
}

function receiveUsers(json) {
    console.log(json);
    return {
        type: RECEIVE_USERS,
        users: json,
        receivedAt: Date.now()
    }
}

function getUsers() {
    return dispatch => {
        dispatch(requestUsers());
        return axios
            .get("/api/users")
            .then(response => dispatch(receiveUsers(response)))
            .catch(err => dispatch(getErrors(err)));
    }
}

function shouldGetUsers(state) {
    const users = state.users;
    if (!users) {
        return true;
    } else {
        return false;
    }
}

export function getUsersIfNeeded() {
    return (dispatch, getState) => {
        if (shouldGetUsers(getState())) {
            return dispatch(getUsers())
        }
    }
}

function updateUsers(res) {
    return {
        type: UPDATE_USER,
        updatedAt: Date.now()
    }
}

export function putUser(json) {
    return dispatch => {
        return axios
            .put("/api/users/" + json._id, json)
            .then(res => dispatch(updateUsers(res)))
            .catch(err => dispatch(getErrors(err)));
    }
}

import axios from "axios";
// import setAuthToken from "../utils/setAuthToken";
// import jwt_decode from "jwt-decode";
// import { get } from "mongoose";

export const REQUEST_USERS = 'REQUEST_USERS'
export const RECEIVE_USERS = 'RECEIVE_USERS'
export const GET_ERRORS = 'GET_ERRORS'
export const UPDATE_USER = 'UPDATE_USER'
export const CREATE_USER = 'CREATE_USER'
export const DELETE_USER = 'DELETE_USER'
export const RECEIVE_USER = 'RECEIVE_USER'
export const REQUEST_USER = 'REQUEST_USER'

function getErrors(payload) {
    return {
        type: GET_ERRORS,
        payload
    }
}
function requestUser() {
    return {
        type: REQUEST_USER
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

function receiveUser(json) {
    console.log(json);
    return {
        type: RECEIVE_USER,
        users: json,
        sentUser:json.data,
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

function shouldGetUser(state) {
    const users = state.users;
    if (!users) {
        return true;
    } else {
        return false;
    }
}

export function getUserIfNeeded(userCode) {
    return (dispatch, getState) => {
        if (shouldGetUser(getState())) {
            return dispatch(getUser(userCode))
        }
    }
}

function getUser(userCode){
    return dispatch => {
        dispatch(requestUser(userCode));
        return axios
            .get("/api/users/" + userCode)
            .then(res => dispatch(receiveUser(res)))
            .catch(err => dispatch(getErrors(err)));
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
        console.log(json);
        return axios
            .put("/api/users/", json)
            .then(res => dispatch(updateUsers(res)))
            .catch(err => dispatch(getErrors(err)));
    }
}


function createUser(res) {
    return {
        type: CREATE_USER,
        createdAt: Date.now()
    }
}

export function postUser(json) {
    return dispatch => {
        return axios
            .post("/api/users", json)
            .then(res => dispatch(createUser(res)))
            .catch(err => dispatch(getErrors(err)));
    }
}

function deleteUser(res) {
    return {
        type: DELETE_USER,
        deletedAt: Date.now()
    }
}

export function delUser(json) {
    return dispatch => {
        return axios
            .delete("/api/users/" + json._id, json)
            .then(res => dispatch(deleteUser(res)))
            .catch(err => dispatch(getErrors(err)));
    }
}

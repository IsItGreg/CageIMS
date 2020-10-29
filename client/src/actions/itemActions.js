import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { get } from "mongoose";

export const REQUEST_ITEMS = 'REQUEST_ITEMS'
export const RECEIVE_ITEMS = 'RECEIVE_ITEMS'
export const GET_ERRORS = 'GET_ERRORS'
export const UPDATE_ITEM = 'UPDATE_ITEM'
export const CREATE_ITEM = 'CREATE_ITEM'

function getErrors(payload) {
    return {
        type: GET_ERRORS,
        payload
    }
}

function requestItems() {
    return {
        type: REQUEST_ITEMS
    }
}

function receiveItems(json) {
    console.log(json);
    return {
        type: RECEIVE_ITEMS,
        items: json,
        receivedAt: Date.now()
    }
}

function getItems() {
    return dispatch => {
        dispatch(requestItems());
        return axios
            .get("/api/items")
            .then(response => dispatch(receiveItems(response)))
            .catch(err => dispatch(getErrors(err)));
    }
}

export function getAvailableItems() {
    return dispatch => {
        dispatch(requestItems());
        return axios
            .get("/api/items/available")
            .then(response => dispatch(receiveItems(response)))
            .catch(err => dispatch(getErrors(err)));
    }
}

function shouldGetItems(state) {
    const items = state.items;
    if (!items) {
        return true;
    } else {
        return false;
    }
}

export function getItemsIfNeeded() {
    return (dispatch, getState) => {
        if (shouldGetItems(getState())) {
            return dispatch(getItems())
        }
    }
}

function updateItems(res) {
    return {
        type: UPDATE_ITEM,
        updatedAt: Date.now()
    }
}

export function putItem(json) {
    console.log(json);
    return dispatch => {
        return axios
            .put("/api/items/" + json._id, json)
            .then(res => dispatch(updateItems(res)))
            .catch(err => dispatch(getErrors(err)));
    }
}

function createItem(res) {
    return {
        type: CREATE_ITEM,
        createdAt: Date.now()
    }
}

export function postItem(json) {
    return dispatch => {
        return axios
            .post("/api/items", json)
            .then(res => dispatch(updateItems(res)))
            .catch(err => dispatch(getErrors(err)));
    }
}
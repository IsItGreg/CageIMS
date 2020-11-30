import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { get } from "mongoose";

export const REQUEST_ITEMS = 'REQUEST_ITEMS'
export const RECEIVE_ITEMS = 'RECEIVE_ITEMS'
export const GET_ERRORS = 'GET_ERRORS'
export const UPDATE_ITEM = 'UPDATE_ITEM'
export const COMPLETED_UPDATED_ITEM = 'COMPLETED_UPDATED_ITEM'

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
            .get("/items/")
            .then(response => dispatch(receiveItems(response)))
            .catch(err => dispatch(getErrors(err)));
    }
}

export function getAvailableItems() {
    return dispatch => {
        dispatch(requestItems());
        return axios
            .get("/items/available")
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

function updateItems() {
    return {
        type: UPDATE_ITEM,
        updatedAt: Date.now()
    }
}

function completedUpdateItems() {
    return {
        type: COMPLETED_UPDATED_ITEM,
        updatedAt: Date.now()
    }
}

export function putItem(json) {
    return dispatch => {
        dispatch(updateItems())
        return axios
            .put("/items/" + json._id, json)
            .then(res => dispatch(completedUpdateItems()))
            .catch(err => dispatch(getErrors(err)));
    }
}

export function postItem(json) {
    return dispatch => {
        dispatch(updateItems())
        return axios
            .post("/items/", json)
            .then(res => dispatch(completedUpdateItems(res)))
            .catch(err => dispatch(getErrors(err)));
    }
}

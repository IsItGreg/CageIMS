import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";
import { get } from "mongoose";

export const REQUEST_TRANSACTIONS = 'REQUEST_TRANSACTIONS'
export const RECEIVE_TRANSACTIONS = 'RECEIVE_TRANSACTIONS'
export const GET_ERRORS = 'GET_ERRORS'
export const UPDATE_TRANSACTION = 'UPDATE_TRANSACTION'
export const CREATE_TRANSACTION = 'CREATE_TRANSACTION'
export const DELETE_TRANSACTION = 'DELETE_TRANSACTION'

function getErrors(payload) {
    return {
        type: GET_ERRORS,
        payload
    }
}

function requestTransactions() {
    return {
        type: REQUEST_TRANSACTIONS
    }
}

function receiveTransactions(json) {
    console.log(json);
    return {
        type: RECEIVE_TRANSACTIONS,
        transactions: json,
        receivedAt: Date.now()
    }
}

function getTransactions() {
    return dispatch => {
        dispatch(requestTransactions());
        return axios
            .get("/api/transactions")
            .then(response => dispatch(receiveTransactions(response)))
            .catch(err => dispatch(getErrors(err)));
    }
}

function shouldGetTransactions(state) {
    const transactions = state.transactions;
    if (!transactions) {
        return true;
    } else {
        return false;
    }
}

export function getTransactionsIfNeeded() {
    return (dispatch, getState) => {
        if (shouldGetTransactions(getState())) {
            return dispatch(getTransactions())
        }
    }
}

function updateTransactions(res) {
    return {
        type: UPDATE_TRANSACTION,
        updatedAt: Date.now()
    }
}

export function putTransaction(json) {
    return dispatch => {
        return axios
            .put("/api/transactions/" + json._id, json)
            .then(res => dispatch(updateTransactions(res)))
            .catch(err => dispatch(getErrors(err)));
    }
}

function createTransaction(res) {
    return {
        type: CREATE_TRANSACTION,
        createdAt: Date.now()
    }
}

export function postTransaction(json) {
    return dispatch => {
        return axios
            .post("/api/transactions", json)
            .then(res => dispatch(updateTransactions(res)))
            .catch(err => dispatch(getErrors(err)));
    }
}

function deleteTransaction(res) {
    return {
        type: DELETE_TRANSACTION,
        deletedAt: Date.now()
    }
}

export function delTransaction(json) {
    return dispatch => {
        return axios
            .delete("/api/transactions/" + json._id, json)
            .then(res => dispatch(deleteTransaction(res)))
            .catch(err => dispatch(getErrors(err)));
    }
}
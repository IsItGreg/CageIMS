import {
    RECEIVE_TRANSACTIONS,
    REQUEST_TRANSACTIONS,
    UPDATE_TRANSACTION,
    CREATE_TRANSACTION,
    DELETE_TRANSACTION
} from "../actions/transactionActions";
const isEmpty = require("is-empty");

export default function (
    state = {
        isGetting: false,
        transactions: []
    },
    action
) {
    switch (action.type) {
        case REQUEST_TRANSACTIONS:
            return Object.assign({}, state, {
                isGetting: true
            })
        case RECEIVE_TRANSACTIONS:
            return Object.assign({}, state, {
                isGetting: false,
                transactions: action.transactions.data,
                lastUpdated: action.receivedAt
            })
        case UPDATE_TRANSACTION:
        case CREATE_TRANSACTION:
        case DELETE_TRANSACTION:
        default:
            return state
    }
}

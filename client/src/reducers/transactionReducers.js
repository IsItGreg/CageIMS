import {
    RECEIVE_TRANSACTIONS,
    RECEIVE_DUE_TRANSACTIONS,
    REQUEST_TRANSACTIONS,
    UPDATE_TRANSACTION,
    CREATE_TRANSACTION,
    DELETE_TRANSACTION,
    START_MULTIPLE_TRANSACTION,
    DONE_MULTIPLE_TRANSACTION,
} from "../actions/transactionActions";
const isEmpty = require("is-empty");

export default function (
    state = {
        isPuttingMultiple: false,
        isGetting: false,
        transactions: [],
        dueTransactions: [],
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

        case RECEIVE_DUE_TRANSACTIONS:
            return Object.assign({}, state, {
                isGetting: false,
                dueTransactions: action.dueTransactions.data,
                lastUpdated: action.receivedAt
            })
        case UPDATE_TRANSACTION: break;
        case CREATE_TRANSACTION: break;
        case DELETE_TRANSACTION: break;
        case START_MULTIPLE_TRANSACTION:
            return Object.assign({}, state, {
                isPuttingMultiple: true
            })
        case DONE_MULTIPLE_TRANSACTION:
            return Object.assign({}, state, {
                isPuttingMultiple: false
            })
        default:
            return state
    }
}

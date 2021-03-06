import {
    RECEIVE_USERS,
    RECEIVE_USER,
    REQUEST_USER,
    REQUEST_USERS,
    UPDATE_USER,
    COMPLETED_UPDATED_USER,
    CREATE_USER,
    DELETE_USER
} from "../actions/userActions";
// const isEmpty = require("is-empty");

export default function (
    state = {
        isUpdating: false,
        isGetting: false,
        users: [],
        sentUser: null,
    },
    action
) {
    switch (action.type) {
        case REQUEST_USERS:
            return Object.assign({}, state, {
                isGetting: true
            })
            break;
        case REQUEST_USER:
            return Object.assign({}, state, {
                isGetting: true,
            })
            break;
        case RECEIVE_USERS:
            return Object.assign({}, state, {
                isGetting: false,
                users: action.users.data,
                lastUpdated: action.receivedAt
            })
        case RECEIVE_USER:
            return Object.assign({}, state, {
                isGetting: false,
                sentUser: action.users.data,
                lastUpdated: action.receivedAt
            })
        case UPDATE_USER:
            return Object.assign({}, state, {
                isUpdating: true
            })
            break;
        case COMPLETED_UPDATED_USER:
            return Object.assign({}, state, {
                isUpdating: false
            })
            break;
        case CREATE_USER:
        case DELETE_USER:
        default:
            return state
    }
}

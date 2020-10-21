import {
    RECEIVE_USERS,
    REQUEST_USERS,
    UPDATE_USER,
    CREATE_USER,
    DELETE_USER
} from "../actions/userActions";
// const isEmpty = require("is-empty");

export default function (
    state = {
        isGetting: false,
        users: []
    },
    action
) {
    switch (action.type) {
        case REQUEST_USERS:
            return Object.assign({}, state, {
                isGetting: true
            })
        case RECEIVE_USERS:
            console.log(action);
            return Object.assign({}, state, {
                isGetting: false,
                users: action.users.data,
                lastUpdated: action.receivedAt
            })
        case UPDATE_USER:
        case CREATE_USER:
        case DELETE_USER:
        default:
            return state
    }
}

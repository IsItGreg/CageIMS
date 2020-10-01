import {
    RECEIVE_USERS,
    REQUEST_USERS,
    USER_LOADING,
    UPDATE_USER,
    CREATE_USER
} from "../actions/userActions";
const isEmpty = require("is-empty");

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
        default:
            return state
    }
}

// export default function (state = initialState, action) {
//     switch (action.type) {
//         case GET_USERS:
//             return {
//                 ...state,
//                 users: action.payload
//             };
//         case USER_LOADING:
//             return {
//                 ...state,
//                 loading: true
//             };
//         default:
//             return state;
//     }
// }
import {
    RECEIVE_ITEMS,
    REQUEST_ITEMS,
    ITEM_LOADING,
    UPDATE_ITEM,
    CREATE_ITEM
} from "../actions/itemActions";
//const isEmpty = require("is-empty");

export default function (
    state = {
        isGetting: false,
        items: []
    },
    action
) {
    switch (action.type) {
        case REQUEST_ITEMS:
            return Object.assign({}, state, {
                isGetting: true
            })
        case RECEIVE_ITEMS:
            console.log(action);
            return Object.assign({}, state, {
                isGetting: false,
                items: action.items.data,
                lastUpdated: action.receivedAt
            })
        case UPDATE_ITEM:
        case CREATE_ITEM:
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
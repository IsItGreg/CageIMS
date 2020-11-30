import {
    RECEIVE_ITEMS,
    REQUEST_ITEMS,
    UPDATE_ITEM,
    COMPLETED_UPDATED_ITEM
} from "../actions/itemActions";
const isEmpty = require("is-empty");

export default function (
    state = {
        isUpdating:false,
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
            return Object.assign({}, state, {
                isUpdating: true
            })
            break;
        case COMPLETED_UPDATED_ITEM:
            return Object.assign({}, state, {
                isUpdating: false
            })
        default:
            return state
    }
}


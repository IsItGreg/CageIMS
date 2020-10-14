import { combineReducers } from "redux";
import authReducer from "./authReducers";
import errorReducer from "./errorReducers";
import userReducer from "./userReducers";
import itemReducer from "./itemReducers"
export default combineReducers({
    auth: authReducer,
    errors: errorReducer,
    user: userReducer,
    item: itemReducer
});
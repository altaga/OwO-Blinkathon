import { combineReducers } from "redux"
import {login_reducer} from "./syncReducers/loginReducer"
import sol_reducer from "./asyncReducers/solReducer";
import account_reducer from "./asyncReducers/accountReducer";

const rootReducers = combineReducers({
    login_reducer,
    sol_reducer,
    account_reducer
})

export default rootReducers;
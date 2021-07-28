import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from "redux-thunk";
import rootReducers from "./reducers/rootReducer";

const store = createStore(rootReducers,composeWithDevTools(
    applyMiddleware(thunk),
    )); 
console.log("REDUX STORE - DELETE DEVTOOLS BEFORE PRODUCTION")

export default store;
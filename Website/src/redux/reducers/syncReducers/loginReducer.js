import { LOGIN_OK } from "../../actions/syncActions/loginAction";

const default_state = {
    value: "",
    extra_data:"Hello World!"
}

export const login_reducer = (state = default_state, action) => {
    switch (action.type) {
        case LOGIN_OK: 
        {
            return {
                ...state, // Keep all state and olny modify counter
                value: action.payload
            }
        }
        default: return state;
    }
}
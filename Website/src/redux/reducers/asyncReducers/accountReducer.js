import { ACCOUNT_SEARCH_REQUEST, ACCOUNT_SEARCH_REQUEST_SUCCESS, ACCOUNT_SEARCH_REQUEST_ERROR } from "../../actions/asyncActions/accountAction";

const default_state = {
    loading: false,
    result:{},
    error:{},
    extra_data:"Hello World!"
}

const account_reducer = (state = default_state, action) =>{
    switch (action.type) {
        case ACCOUNT_SEARCH_REQUEST: {
            return{
                ...state, // Keep all state and olny modify counter
                loading:true
            }
        }
        case ACCOUNT_SEARCH_REQUEST_SUCCESS: {
            return{
                ...state, // Keep all state and olny modify counter
                loading:false,
                result:action.payload,
                error:{}
            }
        }
        case ACCOUNT_SEARCH_REQUEST_ERROR: {
            return{
                ...state, // Keep all state and olny modify counter
                loading:false,
                result:{},
                error:action.payload
            }
        }
        default: return state;
    }
}

export default account_reducer;
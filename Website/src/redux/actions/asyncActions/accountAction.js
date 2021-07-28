var axios = require('axios');

export const ACCOUNT_SEARCH_REQUEST = 'ACCOUNT_SEARCH_REQUEST'
export const ACCOUNT_SEARCH_REQUEST_SUCCESS = 'ACCOUNT_SEARCH_REQUEST_SUCCESS'
export const ACCOUNT_SEARCH_REQUEST_ERROR = 'ACCOUNT_SEARCH_REQUEST_ERROR'

// Actions

export const account_Request = () => {
    return {
        type: ACCOUNT_SEARCH_REQUEST
    }
}

export const account_Request_Success = (result) => {
    return {
        type: ACCOUNT_SEARCH_REQUEST_SUCCESS,
        payload: result
    }
}

export const account_Request_Error = (error) => {
    return {
        type: ACCOUNT_SEARCH_REQUEST_ERROR,
        payload: error
    }
}

const account_action = (value) => {
    return (dispatch) => {
        dispatch(account_Request());
        var config = {
            method: 'get',
            url: 'https://e9wzhv9k7d.execute-api.us-east-1.amazonaws.com/get-account-balance',
            headers: {
                "ewallet": value
            }
        };
        axios(config)
            .then(function (response) {
                dispatch(account_Request_Success(response.data))
            })
            .catch(function (error) {
                dispatch(account_Request_Error(error))
            });
    }
}

export default account_action;
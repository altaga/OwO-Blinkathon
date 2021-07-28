var axios = require('axios');

export const SEARCH_REQUEST = 'SEARCH_REQUEST'
export const SEARCH_REQUEST_SUCCESS = 'SEARCH_REQUEST_SUCCESS'
export const SEARCH_REQUEST_ERROR = 'SEARCH_REQUEST_ERROR'

// Actions

export const search_Request = () => {
    return {
        type: SEARCH_REQUEST
    }
}

export const search_Request_Success = (result) => {
    return {
        type: SEARCH_REQUEST_SUCCESS,
        payload: result
    }
}

export const search_Request_Error = (error) => {
    return {
        type: SEARCH_REQUEST_ERROR,
        payload: error
    }
}

const sol_action = (value) => {
    return (dispatch) => {
        dispatch(search_Request());
        var config = {
            method: 'get',
            url: 'https://e9wzhv9k7d.execute-api.us-east-1.amazonaws.com/get-solana-balance',
            headers: {
                'account': value
            }
        };
        axios(config)
            .then(function (response) {
                dispatch(search_Request_Success(response.data.balance))
            })
            .catch(function (error) {
                dispatch(search_Request_Error(error))
            });
    }
}

export default sol_action;
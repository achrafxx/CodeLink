import {
    REGISTER_SUCCESS,
    REGISTER_FAILED,
    AUTH_ERROR,
    USER_LOADED,
    LOGOUT,
    LOGIN_SUCCESS,
    LOGIN_FAILED,
    ACCOUNT_DELETED
} from '../actions/types'
 
const initState = {
    token: localStorage.getItem("token"),
    isAuthenticated : null,
    loading : true,
    user : null
}

export default function(state=initState,action){
    const {type,payload} = action
    switch(type){
        case REGISTER_SUCCESS :
        case LOGIN_SUCCESS :
            localStorage.setItem("token",payload.token);
            return{
                ...state,
                ...payload,
                isAuthenticated: true,
                loading: false
            }
        case USER_LOADED:
            return{
                ...state,
                isAuthenticated: true,
                loading: false,
                user: payload
            }
        case AUTH_ERROR: 
        case REGISTER_FAILED :
        case LOGIN_FAILED :
        case ACCOUNT_DELETED:
        case LOGOUT: 
            localStorage.removeItem("token");
            return{
                ...state,
                token: null,
                isAuthenticated: false,
                loading: false
            }
        default:
            return state
    }
}
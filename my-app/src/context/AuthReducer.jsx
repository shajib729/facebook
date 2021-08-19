const AuthReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN_START":
            return {
                // ...state,
                user:null,            
                token:null,
                isFecthing: true,
                error:false,
            }
        case "LOGIN_SUCCESS":
            return {
                token:action.payload.token,
                user: action.payload.id,
                isFecthing: false,
                error:false,
            }
        case "LOGIN_FAILURE":
            

            return {
                // ...state,
                user:null,
                token:null,
                isFecthing: false,
                error:action.payload,
            }
        case "USER_LOGOUT":
            localStorage.removeItem('myToken')
            return {
                // ...state,
                user:null,
                token:null,
                isFecthing: false,
                error:null,
            }
        case "RE_RENDER":

            return {
                ...state,
                isFecthing:action.payload
            }
        default:
            return state;
    }
}

export default AuthReducer
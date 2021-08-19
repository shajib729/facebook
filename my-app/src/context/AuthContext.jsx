import { createContext, useEffect, useReducer } from "react"
import AuthReducer from "./AuthReducer"
import jwtDecode from "jwt-decode";

let INITIAL_STATE = {
    token: "",
    user: null,
    isFecthing: false,
    error: false,
    message:null
}

const verifyToken = (token) => {
    const decodeToken = jwtDecode(token);
    const expiresIn = new Date(decodeToken.exp * 1000)
    
    if (new Date() > expiresIn) {
        localStorage.removeItem("myToken")
    } else {
        return decodeToken;
    }
}
    
const token = localStorage.getItem("myToken")
// console.log(token);
if (token) {
    const decoded = verifyToken(token)
    INITIAL_STATE.token = token;
    // console.log(decoded);
    if (decoded.id) {
        const { id } = decoded;
        INITIAL_STATE.user = id ? id : null
        // console.log(INITIAL_STATE.user);
    }
}


export const AuthContext = createContext()

export const AuthContextProvider = ({children}) => {
    const [state, dispatch] = useReducer(AuthReducer, INITIAL_STATE)
    // console.log(state);
    

    useEffect(() => { 
        const token = localStorage.getItem("myToken")
        // console.log(token);   
        if (token) {
            const decoded = verifyToken(token)
            INITIAL_STATE.token = token;
            console.log(decoded);
            if (decoded.id) {
                const { id } = decoded;
                INITIAL_STATE.user = id ? id : null
                console.log(INITIAL_STATE.user);
            }
        }
    },[token])
    return (
        <AuthContext.Provider
            value={{
                token:state.token,
                user: state.user,
                isFecthing: state.isFecthing,
                error: state.error,
                dispatch
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

import { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";

const RouterLinks = (props) => {
    const { user,token } = useContext(AuthContext)
    
    return token ? (
        <Redirect to="/"/>
    ) : (
        <Route path={props.path} exact={props.exact} component={props.component} /> 
    )
}

export default RouterLinks
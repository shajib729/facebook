import React, { useContext } from 'react'
import { Redirect, Route } from 'react-router-dom'
import {AuthContext} from '../../context/AuthContext'

const PrivateRoute = (props) => {

    const {token} = useContext(AuthContext)

    return token ? (
        <Route path={props.path} exact={props.exact} component={props.component} />
    ) : (
        <Redirect to="/login" />
    );
}

export default PrivateRoute

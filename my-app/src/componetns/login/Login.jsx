import React, { useContext, useEffect, useState } from 'react'
import './Login.css'
import { Checkbox,TextField,FormControlLabel} from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { Link, Redirect } from 'react-router-dom';
import Signup from '../signup/Signup';
import  { useHistory  } from 'react-router-dom'
import { Helmet } from "react-helmet";
import {AuthContext} from '../../context/AuthContext'
import toast, { Toaster } from 'react-hot-toast';

const Login = () => {

    const {user,dispatch} =useContext(AuthContext)
    // console.log({user,token,isFecthing,error});
    let history = useHistory ();
    const [handlePopup,setHandlePopup]=useState(false)

    const [values, setValues] = useState({ email: '', password: ""})
    
    const handleChange = (e) => {
        setValues({
            ...values,
            [e.target.name]:e.target.value
        })
    }
    
    const handleSubmit =async (e) => {
        // dispatch({type:"LOGIN_START"})
        e.preventDefault()

        const res=await fetch("/api/login", {
            method: "post",
            headers: {
                'Content-Type': "application/json"
            },
            body: JSON.stringify(values)
        })
        const data = await res.json()
        // console.log(res);
        console.log(data);
        if (res.status == 200) {
            
            toast.success(data.message, {
                style: {
                    padding: '10px',
                    color: '#fff',
                    fontSize: "16px",
                    background: "#62D346"
                },
                iconTheme: {
                    primary: 'white',
                    secondary: '#62D346'
                }
            });
            setTimeout(() => {
                dispatch({ type: "LOGIN_SUCCESS", payload: data })
                localStorage.setItem("myToken", data.token)
            },2000)
        } else if(res.status===400) {
            console.log(data.error);
            // dispatch({ type: "LOGIN_FAILURE", payload: data.error })
            toast.error(data.error, {
                style: {
                padding: '10px',
                color: '#fff',
                fontSize:"16px",
                background:"red"
                },
                iconTheme: {
                primary: 'white',
                secondary: 'red',
                },
            })
        }

    }

    const [showPasword, setShowPasword] = useState(false)

    return (
    <>
            <Toaster
            position="top-center"
            reverseOrder={false}
            />
    
        {/* ######LOGIN###### */}
        <div className="loginContainer">
        
            <Helmet>
                <title>Login Page</title>
            </Helmet>
                
            <div className="loginWrapper">
                <div className="loginLeft">
                    <h3 className="loginLogo">MukhBoi</h3>
                    <span className="loginDesc">
                        Connect with friends and the world aound you.
                    </span>
                </div>
                <div className="loginRight">
                    <div className="loginBox">
                    <form className="loginForm" onSubmit={handleSubmit} autoComplete="off">
                        <TextField 
                            id="outlined-basic"
                            label="Email"
                            type="email"
                            autoComplete="off"
                            variant="outlined"
                            name="email"
                            onChange={handleChange}
                        />
                        <div>
                            <TextField
                                id="outlined-password-input"
                                label="Password"
                                type={showPasword?'text':'password'}
                                autoComplete="off"
                                variant="outlined"
                                name="password"
                                onChange={handleChange}
                            />
                            <FormControlLabel onClick={()=>setShowPasword(!showPasword)} control={<Checkbox icon={<VisibilityOff />} checkedIcon={<Visibility />} />} />
                        </div>
                        <input type="submit" value="Log In" className="loginButton" />
                        </form>
                        <Link to="/signup" className="loginForgot">Forgot Password?</Link>
                        <hr />
                        <a className="newRegisterButton" onClick={()=>setHandlePopup(true)}>Create A New Account</a>
                    </div>
                </div>
            </div>
        </div>
        
        {/* ######REGISTRATION###### */}
            <Signup handlePopup={handlePopup} setHandlePopup={setHandlePopup}/>
        
    </>
    )
}

export default Login

import React, { useState,useContext } from 'react'
import './Signup.css'
import { Checkbox, TextField, FormControlLabel, MenuItem, InputLabel, FormControl, Select } from '@material-ui/core';
import {KeyboardDatePicker} from '@material-ui/pickers';
import { Close, Visibility, VisibilityOff } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import {AuthContext} from '../../context/AuthContext'

const Signup = ({ handlePopup, setHandlePopup }) => {
    
    const {user,dispatch} =useContext(AuthContext)

    const [values, setValues] = useState({ username: '', email: '', password: "", cpassword: "",date:''})
    
    const handleChange = (e) => {
        setValues({
            ...values,
            [e.target.name]:e.target.value
        })
    }

    const handleSubmit =async (e) => {
        e.preventDefault();
        // console.log(values);

        const res=await fetch("/api/register", {
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
        } else {
            dispatch({ type: "LOGIN_FAILURE", payload: data.error })
            toast.error(data.error.username || data.error.email || data.error.password || data.error.cpassword || data.error, {
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
        <div className={handlePopup ? "signupContainer" : "hide signupContainer"}>
            
            {/* <Toaster
            position="top-center"
            reverseOrder={false}
            /> */}

            <div className="signupBox">
                <Close className="hideSignup" onClick={()=>setHandlePopup(false)}/>
                <h4 className="signupTitle">Sign Up</h4>
                <p className="signupDesc">It's quick and easy</p>
                <hr />
                <form onSubmit={handleSubmit} autoComplete="off" className="signupForm">
                    <TextField
                        className="fields" 
                        id="outlined-basic"
                        label="Full Name"
                        type="text"
                        autoComplete="off"
                        variant="outlined"
                        name="username"
                        onChange={handleChange}
                    />
                    <TextField
                        className="fields" 
                        id="outlined-basic"
                        label="Email"
                        type="email"
                        autoComplete="off"
                        variant="outlined"
                        name="email"
                        onChange={handleChange}
                    />
                    <div className="fields">
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
                    <div className="fields">
                        <TextField
                            id="outlined-password-input"
                            label="Confirm Password"
                            type={showPasword?'text':'password'}
                            autoComplete="off"
                            variant="outlined"
                            name="cpassword"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="fields birthDay">
                        
                        <TextField
                            id="date"
                            label="Birthday"
                            type="date"
                            name='date'
                            InputLabelProps={{
                                shrink: true,
                            }}
                            onChange={handleChange}
                        />
                    
                    </div>
                    
                    <input className="signupButton" type="submit" value="Sign Up" />

                </form>
            </div>
        </div>
    )
}

export default Signup

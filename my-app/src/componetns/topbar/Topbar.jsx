import React, { useContext, useEffect, useState } from 'react'
import './Topbar.css'
import { Link } from 'react-router-dom';
import {Chat, Notifications, Person, Search} from '@material-ui/icons';
import { AuthContext } from '../../context/AuthContext';

const Topbar = () => {
    const { user,dispatch,isFecthing } = useContext(AuthContext)
    // console.log(user);
    const [authUser,setAuthUser]=useState({})

    const logout =async () => {
        dispatch({ type: "USER_LOGOUT" })
        const res = await fetch("/api/logout", {
            method: "get"
        })
        const data = await res.json()
        console.log(data);
    }
    const getUser = async () => {
        const res = await fetch('/api/authUser', {
            method:"get"
        })
        const data = await res.json()
        setAuthUser(data);
    }

    useEffect(() => {
        getUser()
        window.scrollTo(0, 0);
    },[user,isFecthing])



    return user?(
        <section className="topbarContainer">
            {/* Topbar Left Side  */}
            <div className="topbarLeft">
                <Link to="/" className="logo">MukhBoi</Link>
            </div>

            {/* Topbar Middle Side  */}
            <div className="topbarCenter">
                <div className="searchBar">
                    <Search className="searchIcon" />
                    <input type="text" placeholder="Search for riend, post or video" className="searchInput" />
                </div>
            </div>

            {/* Topbar Right Side  */}
            <div className="topbarRight">
                <div className="topBarLinks">
                    <span className="topBarLink">Hompage</span>
                    <span className="topBarLink" onClick={logout}>Logout</span>
                </div>
                <div className="topBarIcons">
                    <div className="topBarIconItem">
                        <Person />
                        <span className="topBarIconBadge">1</span>
                    </div>
                    <Link to="/messages" className="topBarIconItem">
                        <Chat/>
                        <span className="topBarIconBadge">1</span>
                    </Link>
                    <div className="topBarIconItem">
                        <Notifications/>
                        <span className="topBarIconBadge">1</span>
                    </div>
                </div>
                <Link onClick={()=>dispatch({type:"RE_RENDER",payload:Date.now()})} to={`/profile/${user}`}><img src={authUser?authUser.profilePicture:"../images/noAvatar.png"} alt="Profile" className="topBarImg"/></Link>
            </div>
            
        </section>
    ):null
}

export default Topbar

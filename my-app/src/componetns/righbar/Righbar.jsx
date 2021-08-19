import React, { useContext,useEffect, useState } from 'react'
import './Righbar.css'
import {Users} from '../../dummyData'
import Online from '../online/Online'
import { AuthContext } from '../../context/AuthContext'
import { Link, useLocation } from 'react-router-dom'
import { Add, Remove } from '@material-ui/icons'
import FollowButton from './FollowButton'

const HomeRightBar = () => {
    return (
        <>
            <div className="birthdayContainer">
                <img className="birthdayImg" src="./images/gift.png" alt="" />
                <span className="birthdayText">
                    <b>Tohid</b> and <b>3 other friends</b> have a birthday today
                </span>
            </div>
            <img src="./images/add.png" alt="" className="rightbarAd" />
            <h4 className="rightbarTitle">
                Online Friends
            </h4>
            <ul className="rightbarFriendList">
                {Users.map((u) => (
                    <Online key={u.id} user={u}/>
                ))}
            </ul>
        </>
    )
}

const ProfileRightBar = ({userId}) => {

    const { user, dispatch, isFecting } = useContext(AuthContext)
    
    const { pathname } = useLocation()
    const [friends,setFriends] = useState([])
    const [followings,setFollowings] = useState([])

    const getFriends = async () => {
        const res = await fetch(`/api/api/friends/${userId.id}`, {
            method:"get"
        })
        const data = await res.json()
        // console.log(data);
        await setFriends(data);
    }

    const getFollwings = async () => {
        const res = await fetch(`/api/api/get/following`, {
            method:"get"
        })
        const data = await res.json()
        setFollowings(data.message)
        dispatch({ type: 'RE_RENDER',payload:Date.now()})
    }

    const handleFollow = async (req) => {
        const res = await fetch(`/api/user/${userId.id}/${req}`, {
            method:"PATCH"
        })
        const data = await res.json()
        console.log(data);
        dispatch({ type: 'RE_RENDER',payload:Date.now()})
    }

    useEffect(() => {
        getFriends()
        getFollwings()
    }, [ isFecting,pathname])

    return (
        <>
            <FollowButton userId={userId} />

            <h4 className="rightbarTitle">User Information</h4>
            <div className="rightbarInfo">
                <div className="rightbarInfoItem">
                    <span className="rightbarInfoKey">City:</span>
                    <span className="rightbarInfoValue">Rawzan</span>
                </div>
                <div className="rightbarInfoItem">
                    <span className="rightbarInfoKey">From:</span>
                    <span className="rightbarInfoValue">Bangladesh</span>
                </div>
                <div className="rightbarInfoItem">
                    <span className="rightbarInfoKey">Relationsip:</span>
                    <span className="rightbarInfoValue">Single</span>
                </div>
            </div>
            <h4 className="rightbarTitle">User Friends({friends.length})</h4>
            <div className="rightbarFollowings">
                {
                    friends ? friends.map((friend) => (
                    <Link onClick={()=>dispatch({type:"RE_RENDER",payload:Date.now()})} to={`/profile/${friend._id}`} className="rightbarFollowing">
                        <img className="rightbarFollwingImg" src={friend.profilePicture} alt="" />
                        <span className="rightbarFollowingName">{friend.username}</span>
                    </Link>
                )):<h1>Loading...</h1>
                }
            </div>
        </>
    )
}

const Righbar = ({ profile, userId }) => {
    
    return (
        <div className='rightbarContainer'>
            <div className="rightbarWrapper">
                {profile ? <ProfileRightBar userId={userId}/>:<HomeRightBar/>}
            </div>
        </div>
    )
}

export default Righbar

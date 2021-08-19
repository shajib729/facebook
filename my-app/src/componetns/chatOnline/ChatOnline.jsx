import React, { useEffect, useState } from 'react'
import './ChatOnline.css'

const ChatOnline = ({ onlineUsers, user }) => {

    const [onlineFriends,setOnlineFriends]=useState([])

    const getFriends = async () => {
        const res = await fetch(`/api/api/friends/${user}`, {
            method:"get"
        })
        const data = await res.json()
        console.log(data);
        // setOnlineFriends(data?.filter(e=>onlineUsers?.includes(e._id)))
        setOnlineFriends(data?.filter(e=>onlineUsers?.includes(e._id)))
    }

    useEffect(() => {
        getFriends()        
    },[])

    console.log(onlineFriends,onlineUsers,user);
    return (
        <>
        {
        onlineFriends.map((friend)=>(
        <div className="chatOnlineFriends">
            <div className="chatOnlineFriend">
                <div className="chatOnlineImgContainer">
                    <img className="chatOnlineImg" src={friend.profilePicture} alt="" />
                    <span className="chatOnlineBadge"></span>
                </div>
                    <div className="chatOnlineUsername">{friend.username}</div>
            </div>
        </div>
        ))
        }
        </>
    )
}

export default ChatOnline

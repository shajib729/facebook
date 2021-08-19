import React, { useEffect, useState } from 'react'
import './Conversation.css'

const Conversation = ({ conversation,currentUser }) => {
    const [user, setUser] = useState([])
    
    const friendId = conversation.members.find((m) => m !== currentUser)
            
    const getUser = async () => {
        try {
            const res = await fetch('/api/user/' + friendId, {
                method:'get'
            })
            const data = await res.json()
            setUser(data.user);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getUser()
    }, [currentUser, conversation])

    return (
        <div className="conversationContainer">
            <img className="conversationImg" src={user.profilePicture} alt="" />
            <span className="coversationName">{user.username}</span>
        </div>
    )
}

export default Conversation

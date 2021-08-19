import React from 'react'
import './Message.css'
import moment from 'moment'

const Message = ({message,own}) => {
    return (
        <div className={`message ${own}`}>
            <div className="messageTop">
                <img className="messageImg" src="../images/person5.jpg" alt="" />
                <p className="messageText">{message?.text}</p>
            </div>
            <div className="messageBottom">{moment(message?.createdAt).fromNow()}</div>
        </div>    
    )
}

export default Message

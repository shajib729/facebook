import React, { useContext,useEffect,useRef,useState } from 'react'
import './Messengerr.css'
import { Helmet } from 'react-helmet'
import Conversation from '../conversation/Conversation'
import Message from '../message/Message'
import {Send} from '@material-ui/icons';
import ChatOnline from '../chatOnline/ChatOnline'
import {AuthContext} from '../../context/AuthContext'
import { NavLink, useParams } from 'react-router-dom'
import {io} from "socket.io-client";

// const socket = io.connect("http://localhost:5000");

const Messenger = () => {
    const { id } = useParams()
    const scrollBottom=useRef()
    const [conversations, setConversations] = useState()
    const [currentChat, setCurrentChat] = useState(id)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState()    
    const [onlineUsers, setOnlineUsers] = useState()    
    const [arrivalMessage, setArrivalMessage] = useState()    
    const { user, isFecthing, dispatch } = useContext(AuthContext)
    let [socket,setSocket]=useState(io("/"))
    
    const handleSubmit =async (e) => {
        e.preventDefault()
        if (newMessage.trim()) {
            const message={
                senderId: user,
                text: newMessage,
                conversationId:currentChat
            }

            const receiverId = conversations?.find((conversation) => {
                return conversation._id===currentChat
            }).members.find(rec=>rec!==user)
        
            socket.emit("sendMessage", {
                senderId: user,
                receiverId,
                text: newMessage,
            });
            
            const res = await fetch('/api/messages', {
                method: "post",
                headers: {
                    'Content-Type':'application/json'
                },
                body:JSON.stringify(message)
            })
            const data = await res.json()
            // console.log(res);
            // console.log(data);
            if (res.status === 200) {
                dispatch({ type: "RE_RENDER", payload: Date.now() })
                setNewMessage('')
            }
        }
    }
    

   
    const getConversations = async () => {
        try {
            const res = await fetch('/api/conversation/' + user, {
                method:"get"
            })
            const data = await res.json()
            // console.log(data);
            setConversations(data.message);
        } catch (err) {
            console.log(err.message);
        }
    }
    
    const getMessages = async () => {
        try {
            const res = await fetch('/api/messages/' + currentChat, {
                method:"get"
            })
            const data = await res.json()
            // console.log(data);
            setMessages(data.message);
        } catch (err) {
            // console.log(err.message);
        }
    }

    useEffect(() => {
       getConversations() 
       getMessages()
        setTimeout(() => {
            scrollBottom.current?.scrollIntoView({behaviour:"smooth"})
        },500)
    }, [isFecthing])

// connect socket     
  useEffect(() => {
    // const socket = io("http://localhost:5000")// connected socekt with client
    // socket.on("welcome", data => {
    //   console.log('Socket : ',data);
    // });
      
    // add user
      socket.emit("addUser", user)
      socket.on("getUsers", (users) => {
        console.log(users);
        setOnlineUsers(users?.map(e=>e.userId)?.filter(i=>i!==user));
      })

      //get message
      socket.on("getMessage", (data) => {
        //   console.log(data);
          setArrivalMessage({
              senderId: data.senderId,
              text: data.text,
              createddAt:Date.now(),
          })
        // setTimeout(() => {
        //     // dispatch({ type: "RE_RENDER", payload: Date.now() })
        //     scrollBottom.current?.scrollIntoView({behaviour:"smooth"})
        // }, 200)
      })
      
  }, [socket]);
    
    useEffect(() => {
        console.log(arrivalMessage);
        arrivalMessage && conversations?.members?.includes(arrivalMessage.senderId)
        messages?.length && setMessages([...messages, arrivalMessage])
        dispatch({type:"RE_RENDER",payload:Date.now()})
    }, [arrivalMessage])
    
    return (
        <div>
            <Helmet>
                <title>Messages | MukhBoi</title>
            </Helmet>
            <div className="messengerContainer">
                
                {/* chat menu left  */}
                <div className="chatMenu">
                    <div className="chatMenuWrapper">
                        <h2 className="chatLogo">Chat</h2>
                        <input className="searchMessenger" type="text" placeholder="Search Messenger"/>
                        {
                             conversations?
                             conversations.length>=1?conversations.map((conversation) =>(
                                <NavLink activeClassName="navActive" to={`/messages/${conversation._id}`} onClick={() => {
                                    setCurrentChat(conversation._id)
                                    setNewMessage('')
                                    dispatch({type:"RE_RENDER",payload:Date.now()})
                                }}>
                                    <Conversation currentUser={user} conversation={conversation} />
                                </NavLink>
                            )):<h2 style={{color:'gray',userSelect:'none'}}>No user found! Search Your Friends...🤷‍♀️</h2>
                            :<h1>Loading...</h1>
                        }
                    </div>
                </div>

                {/* chat box middle */}
                <div className="chatBox">
                    {
                        currentChat ? (
                        <>                    
                            {/* chat box top  */}
                            <div className="chatBoxTop">
                                <div className="messageTopWrapper">
                                    <img className="messageTopImg" src="../images/person5.jpg" alt="" />
                                    <div className="messageTopInfo">
                                        <span className="messageTopName">
                                            Sajidul Islam
                                        </span>
                                        <span className="messageTopStatus">
                                            Active Now
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* chat box middle messages  */}
                            <div className="messages">
                                {
                                    messages?
                                    messages.length?(messages.map((m,i)=>
                                        <div ref={scrollBottom}>
                                        <Message key={i} message={m} own={m?.senderId===user?'own':''}/>
                                        </div>
                                    )):<h1 style={{display: 'flex', justifyContent: "center", alignItems:'center',height:'100%'}}>No message😪</h1>
                                    : <h1 style={{display: 'flex', justifyContent: "center", alignItems:'center',height:'100%'}}>Loading...</h1>
                                }
                            </div>

                            {/* chat box bottom input  */}
                            <div className="chatBoxBottom">
                                <form onSubmit={handleSubmit}>
                                    <input onChange={(e)=>setNewMessage(e.target.value)} value={newMessage} className="chatBoxInput" type="text" placeholder="Type Message..." />
                                    <label htmlFor="submit">
                                        <Send className="submitButton" />
                                    </label>
                                    <input style={{display:'none'}} type="submit" id="submit" />
                                </form>
                            </div>
                        </>
                        ):<span className="noChatUser">Please select a user to start the conversation...😐</span>
                    }
                </div>

                {/* chat online right */}
                <div className="chatOnline">
                    <div className="chatOnlineWrappper">
                        <h3>Online Users</h3>
                        <ChatOnline onlineUsers={onlineUsers} user={user}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Messenger

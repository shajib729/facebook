import { MoreVert, ThumbUpAltOutlined, ThumbUpAltSharp } from '@material-ui/icons'
import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import './Post.css'
import { Users } from '../../dummyData'
import moment from 'moment'
import { AuthContext } from '../../context/AuthContext'

const Post = ({ post, rootUser }) => {
    const {dispatch} =useContext(AuthContext)
    
    const [like,setLike]=useState(post.likes.length)
    const [isLike, setIsLike] = useState(post.likes.includes(rootUser.toString()))
    const [user, setUser] = useState({})

    const likeHandler =async () => {
        setIsLike(!isLike)
        setLike(isLike ? like - 1 : like + 1)

        console.log(post._id);

        const res=await fetch(`/api/post/like/${post._id}`, {
            method: "PATCH",
            headers: {
                'Content-Type': "application/json"
            },
            body:JSON.stringify({isLike})
        })
        const data = await res.json()
        console.log(res);
        console.log(data);

    }

    // console.log(post.likes.includes(rootUser.toString()));

    return (
        <div className="postContainer">
            <div className="postWrapper">
                {/* post top  */}
                <div className="postTop">
                    <div className="postTopLeft">
                        <Link onClick={()=>dispatch({type:"RE_RENDER",payload:Date.now()})} to={`/profile/${post.userId._id}`}><img className="postProfileImg" src={post.userId.profilePicture} alt="profile" /></Link>
                        <Link onClick={()=>dispatch({type:"RE_RENDER",payload:Date.now()})} to={`/profile/${post.userId._id}`} className="postUsername">{post.userId.username}</Link>
                        <span className="postDate">{moment(post.updatedAt).fromNow()}</span>
                    </div>
                    <div className="postTopRight">
                        <MoreVert/>
                    </div>
                </div>

                {/* post middle  */}
                <div className="postCenter">
                    <span className="postText">{post.desc || '' }</span>
                    {post.img?<img className="postImg" src={post.img} alt="image" />:null}
                </div>

                {/* post bottom  */}
                <div className="postBottom">
                    <div className="postBottomLeft">
                        {isLike?<ThumbUpAltSharp style={{color:"#1877f2"}} className="likeButton" onClick={likeHandler} />:<ThumbUpAltOutlined className="likeButton" onClick={likeHandler} />}
                        <div className="likeCounter">
                            {like} peoples like it
                        </div>
                    </div>
                    <div className="postBottomRight">
                        <span className="postCommentText">
                            {post.comment} comment
                        </span>
                    </div>
                </div>
                
            </div>
        </div>
    )
}

export default Post

import React, { useContext, useEffect, useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import { AuthContext } from '../../context/AuthContext'
import Share from "../share/Share";
import Post from "../post/Post";
import "./Feed.css";

const Feed = ({ user }) => {

  const {isFecthing} = useContext(AuthContext)

  const [posts, setPosts] = useState({ postss: [], rootUser: "" });

  const getPost = async () => {
    const res = await fetch("/api/post/all/timeline", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    // console.log(res);
    // console.log(data); 
    if (res.status === 200) {
      setPosts({ postss: data.data, rootUser: data.rootUser });
      // posts.rootUser?console.log(posts.rootUser):console.log('')
    } else {
      // console.log(false);
      localStorage.removeItem("myToken")
    }
  };

  useEffect(() => {
    getPost();
  }, [isFecthing]);

  return (
    <div className="feedContainer">
      <div className="feedWrapper">
        <Share user={user} />
        {
            
            !user ? (
              posts ? (
                posts.postss.map((post) => (
                  <Post key={post._id} post={post} rootUser={posts.rootUser} />
                ))
              ) : (
                <h1>Loading</h1>
              )
            ) : (
              posts.postss.filter((id)=>id.userId._id===user._id).length ? <div> {
              posts ? (
                posts.postss.filter(userPost => userPost.userId._id === user._id).map((post) => (
                  <Post key={post._id} post={post} rootUser={posts.rootUser} />
                ))
              ) : (
                <h1>Loading</h1>
              )}</div>:<h1 style={{textAlign:"center"}}>No Post Is Created...😪</h1>
            )
            
          
        }
      </div>
    </div>
  )
};

export default Feed;

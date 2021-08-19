import React,{useContext, useEffect, useState} from 'react'
import { useHistory, useParams, useLocation } from 'react-router-dom';
import Feed from '../../componetns/feed/Feed';
import Righbar from '../../componetns/righbar/Righbar';
import Sidebar from '../../componetns/sidebar/Sidebar';
import { AuthContext } from '../../context/AuthContext';
import '../home/home.css'
import './Profile.css'

export const Profile = () => {
    const { pathname } = useLocation();

    const {user,isFecthing}=useContext(AuthContext)

    const history=useHistory()

    const [datas,setDatas]=useState([])

    const userId = useParams()

    const getPost2 = async () => {
        const res=await fetch(`/api/api/profile/${userId.id}`, {
            method: "get",
            headers: {
                'Content-Type': "application/json"
            }
        })
        const data = await res.json()
        // console.log(res);
        if (res.status === 200) {
            setDatas(data);
            // datas?console.log(datas):console.log();
        } else {
            history.push("/login");
        }
    }

    useEffect(() => {
        getPost2()
    },[isFecthing,pathname])

    return datas.currentUser? (
        <div className="profileContainer">
            <Sidebar />
            <div className="profileRight">
                <div className="profileRightTop">
                    <div className="profileCover">
                        
                        <img className="profileCoverImg" src={datas.currentUser.coverPicture} alt="" />
                        {datas.currentUser.profilePicture?<img className="profileUserImg" src={datas.currentUser.profilePicture} alt="profile" />:<div></div>}
                    </div>
                    <div className="profileInfo">
                        <h4 className="profileInfoName">{datas.currentUser.username}</h4>
                        <span className="profileInfoDesc">Hello My Friends</span>
                    </div>
                </div>            
                <div className="profileRightBottom">
                    <Feed user={datas.currentUser} />
                    <Righbar userId={userId} profile={true}/>
                </div>            
            </div>
        </div>
    ):<h1>Loading</h1>
}

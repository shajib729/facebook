import { EmojiEmotions, Label, PermMedia } from '@material-ui/icons'
import React,{useContext, useEffect, useState} from 'react'
import { AuthContext } from '../../context/AuthContext'
import './Share.css'
import toast, { Toaster } from 'react-hot-toast';

const Share = ({ user }) => {

    const state=useContext(AuthContext)
    
    const [posts, setPosts] = useState({ desc: '', file: '',src:'',alt:'' })
    
    const handleFile = (e) => {
        setPosts({
            ...posts,
            desc:e.target.name==='desc'?e.target.value:posts.desc,
            file:e.target.name==='file'?e.target.files[0]:posts.file,
            src: e.target.files?URL.createObjectURL(e.target.files[0]):posts.src,
            alt: e.target.files?e.target.files[0].name:posts.alt
        })
    }

    const handleForm =async (e) => {
        e.preventDefault()
        
        const formData=new FormData()
        formData.append('desc',posts.desc)
        formData.append('img', posts.file)
        
        const res=await fetch('/api/post/create', {
            method: "POST",
            heades: {
              'Content-Type':"application/json"  
            },
            body:formData
        })
        const data=await res.json()
        // console.log(res);
        // console.log(data);
        if (res.status === 200) {      
            state.dispatch({ type: "RE_RENDER", payload:Date.now() })    
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
            setPosts({ desc: '', file:'',src:'',alt:'' })
        } else if(res.status===400) {
            toast.error(data.error, {
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

    const [authUser,setAuthUser]=useState({})
    
    const getUser = async () => {
        const res = await fetch('/api/authUser', {
            method:"get"
        })
        const data = await res.json()
        setAuthUser(data);
    }
    useEffect(() => {
        getUser()
    }, [state.isFecting])

    user ? user = user._id : user = state.user
    
    return user===authUser._id?(
        <div className="shareContainer">
             <Toaster
            position="top-center"
            reverseOrder={false}
            />
            <div className="shareWrapper">
                {/* share top  */}
                <div className="shareTop">
                    <img style={{userSelect:"none"}} className="shareTopProfile" src={authUser?authUser.profilePicture: '../images/noProfile.png'} alt="" />
                    <input onChange={handleFile} value={posts.desc} name='desc' className="shareInput" type="text" placeholder={`What's in your mind, ${authUser.username.split(' ')[0]}?`} />
                </div>

                <hr className="shareHr" />

                {/* share bottom  */}
                <form enctype="multipart/form-data" className="shareBottom" onSubmit={handleForm}>
                    <div style={{marginBottom:posts.file?"15px":'0'}} className="shareOptions">
                        <div className="shareOption">
                            <label style={{cursor:"pointer"}} htmlFor="file">
                            <PermMedia htmlColor="#45BD62" className="shareIcon"/>
                            <span className="shareOptionText">Photo</span>
                            </label>
                            <input style={{display:'none'}} name='file' type="file" id="file" accept='.png,.jpeg,.jpg' onChange={handleFile} />
                        </div>
                        <div className="shareOption hide1">
                            <Label htmlColor="#F02849" className="shareIcon"/>
                            <span className="shareOptionText">Tag</span>
                        </div>
                        <div className="shareOption hide2">
                            <EmojiEmotions htmlColor="#F8C03E" className="shareIcon"/>
                            <span className="shareOptionText">Feelings</span>
                        </div>
                        <button type='submit' className="shareButton">Share</button>
                    </div>
                    <img style={{maxWidth:"100%"}} src={posts.src} alt={posts.alt} />
                </form>
            </div>
        </div>
    ):null
}

export default Share

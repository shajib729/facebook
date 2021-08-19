import React, { useContext,useState,useEffect }from 'react'
import { AuthContext } from '../../context/AuthContext'
import { Add, Remove } from '@material-ui/icons'

const FollowButton = ({ userId }) => {
    
    const { user, dispatch, isFecthing } = useContext(AuthContext)
    const [followings,setFollowings] = useState([])

    const getFollwings = async () => {
        const res = await fetch(`/api/api/get/following`, {
            method:"get"
        })
        const data = await res.json()
        console.log(data);
        setFollowings(data.message)
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
        getFollwings()
    }, [isFecthing])

    return (
        <div>
            {userId.id !== user ?
                !followings.includes(userId.id)?
                    <span onClick={() => handleFollow('follow')} class="followButton">FOLLOW <Add /></span>
                    : <span onClick={() => handleFollow('unfollow')} class="followButton" style={{ background: "#ff3434" }}>Unfollow <Remove /></span>
                : null
            }
        </div>
    )
}

export default FollowButton

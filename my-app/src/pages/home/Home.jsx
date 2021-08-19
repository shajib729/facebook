import React from 'react'
import Feed from '../../componetns/feed/Feed';
import Righbar from '../../componetns/righbar/Righbar';
import Sidebar from '../../componetns/sidebar/Sidebar';
import './home.css'
import { Helmet } from 'react-helmet'

const Home = () => {
    return (
        <div className="homeContainer">
            <Helmet>
                <title>Home | MukhBoi</title>
            </Helmet>
            <Sidebar />
            <Feed />
            <Righbar/>
        </div>
    )
}

export default Home

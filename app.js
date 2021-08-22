require('dotenv').config()
require("./db/conn")
const express = require("express")
const app = express()
const port = 5000 || process.env.PORT
const helmet = require("helmet")
const morgan = require("morgan")
const cors = require('cors')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload');
const path=require('path')

// internal import
const router=require('./routes/user.js')
const postRouter=require('./routes/post.js')

// middleware
app.use(express.json())

app.use(cookieParser())

app.use(helmet())

// app.use(morgan())

// app.use(cors())

// default options
app.use(fileUpload());

app.use('/api',require('./routes/user.js'))
app.use('/api',require('./routes/post.js'))
app.use('/api',require('./routes/conversations'))
app.use('/api', require('./routes/messages'))


// 3: setup in heroku 

// if (process.env.NODE_ENV !== 'production') {
//     app.use(express.static(path.join(__dirname,"./my-app/build")))
//     app.get('*', (req, res) => {
//         res.sendFile(path.join(__dirname, "my-app/build", "index.html"));
//     })
// }

// socket api started 
const http=require('http').createServer(app)
const io = require('socket.io')(http, {
    cors: {
        origin: "/",
    }
})

//TODO: let socketsConnected = new Set()

let users = [];

const addUser = (userId, socketId) => {
  !users.some((user) => user.userId == userId) &&
    users.push({ userId, socketId });
};

const removeUser = (socketId) => {
  users = users.filter((user) => user.socketId !== socketId);
};

const getUser = (userId) => {
  return users.find((user) => user.userId === userId);
};

io.on('connection', function (socket) {
    
    // when connect 
    console.log(socket.id, ' A Connected User');
    
    //TODO: socketsConnected.add(socket.id)

    io.emit('welcome',"HEllo, Welcome to my messenger.")

    //TODO: io.emit('clients-total',socketsConnected.size)

    //take userId and socketId from user
    socket.on("addUser", (userId) => {
        console.log(userId);
        addUser(userId, socket.id);
        io.emit("getUsers", users);
        console.log(users);
    });

    //send and get message
    socket.on("sendMessage", ({ senderId, receiverId, text }) => {
        const user = getUser(receiverId);
        io.to(user?.socketId).emit("getMessage", {
        senderId,
        text,
        });
    });

    // when disconnect 
    socket.on('disconnect', () => {
        console.log(`Socket disconnected ${socket.id}`);
        removeUser(socket.id)
        io.emit("getUsers", users);
        // socketsConnected.delete(socket.id)
        // io.emit('clients-total',socketsConnected.size)
    })

})


http.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
})

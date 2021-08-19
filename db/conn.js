const mongoose = require('mongoose')
const DB_URI = process.env.DB_URI

mongoose.connect(DB_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology:true,
    useFindAndModify:false
}).then(() => {
    console.log("Connection Successful");
}).catch((err)=>{
    console.log("No connection");
})
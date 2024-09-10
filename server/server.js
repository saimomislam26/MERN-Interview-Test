const app = require('./app')
const mongoose = require('mongoose')
// vbrzLhoEUkmLGcpw

const database = process.env.MONGODB_URL

mongoose.connect(database).then(()=>{
    console.log("Database Connected");
}).catch((err)=>{
    console.log("Error",err);
})

app.listen('5000',()=>{
    console.log("Port is listening on port 5000");
})
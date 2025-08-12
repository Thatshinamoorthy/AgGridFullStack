const server = require('./app.js');
const dotenv = require('dotenv');
dotenv.config();
const db = require('./Config/dataBase.js');

db();

server.listen(process.env.PORT,()=>{
    console.log("Socket Server is Running..!");
})
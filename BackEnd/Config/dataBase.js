const mongoose = require('mongoose');

const connectDB = ()=>{
    mongoose.connect(process.env.DB_URL,{
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then((con)=>{
        console.log(con.connection.host);
        console.log("DB connected..!");
    }).catch(err=>{
        console.log("mongoDB Error : ",err);
    })
}

module.exports = connectDB;
const mongoose = require('mongoose');

 function connectToDb (){
    mongoose.connect(process.env.DB_CONNECT, 
        ).then(()=>{
            console.log('Connected to Db')
         }).catch(err=>{
            console.error('Error connecting to Db', err)
         })
    const db = mongoose.connection;
 }
 module.exports = connectToDb;
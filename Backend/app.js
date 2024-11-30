const dotenv = require('dotenv');
dotenv.config()
const express = require('express');
const cors = require('cors');
const app = express();
const connectToDb = require('./db/db')
connectToDb()
app.use(cors())
const userRoutes = require('./routes/user-route')
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.get('/',(req ,res)=>{
    res.send('Hello World!')
})
app.use('/users',userRoutes)
module.exports = app;
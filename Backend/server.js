const http = require('http');
const app =require('./app')
const server = http.createServer(app)
const port = process.env.Port || 3000
server.listen(port, ()=>{
    console.log(`Server is running on port ${port}`)  // log the port where the server is running
}) 
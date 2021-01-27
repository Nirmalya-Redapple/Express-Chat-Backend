var express = require('express');
const { connect } = require('mongoose');
const connectDB = require('./config/db');
var app = express();
var cors = require('cors');
//Connect DB
connectDB();
var PORT = process.env.PORT || 5000;
app.use(cors());
// Init Middleware
app.use(express.json({extended:false}));
const jwt = require('jsonwebtoken');
const config = require('config');


// Define Routes 
app.use('/api/users',require('./routes/api/users'));
app.use('/api/auth',require('./routes/api/auth'));
app.use('/api/profile',require('./routes/api/profile'));
app.use('/api/posts',require('./routes/api/posts'));

app.get('/',(req,res)=>res.send('API Running'));    

// const swaggerUi = require('swagger-ui-express');
// const swaggerDocument = require('./swagger.json');

// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));









const server = app.listen(PORT,
    ()=>console.log(`Server Started on Port ${PORT}`));
    
    
    


var socket = require("socket.io");
var io = socket(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
          credentials: true
    }
  });
io.on('connection', function(socket){
    socket.on('chat-message',function(data){
        data.sender=socket.user
        
        io.to(data.tosent).emit('chat-message',data); 
    });
    socket.on('join',async function(data){
        const decoded = jwt.verify(data.token, config.get('jwtSecret'));
        const user = decoded.user;
        await socket.join(user.id);
        socket.user = user.id; 
        console.log("User Connected to ROOM :"+socket.user);
        io.to(socket.user).emit('join',"Congratulation you are joined"); 
    });
})



//https://socket.io/docs/v3/client-socket-instance/
//https://socket.io/docs/v3/client-socket-instance/
//https://socket.io/docs/v3/rooms/#Joining-and-leaving
//https://socket.io/docs/v3/index.html
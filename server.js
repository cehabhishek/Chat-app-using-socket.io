const express = require("express");
const app = express();



const PORT = process.env.PORT || 5000;
const http = require("http").createServer(app);

app.use(express.static(__dirname + "/public"));

http.listen(PORT, () => {
  console.log(`Server Running at ${PORT}`);
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

const io = require('socket.io')(http);

const users = {};
io.on('connection',socket => {
    
    socket.on('newUser', name => {
        users[socket.id] = name;
        // console.log('new user',name);
        socket.broadcast.emit('userJoined',name);
    });

    socket.on('send',(message) => {
      //  console.log(message);
        socket.broadcast.emit('recieve',{users : users[socket.id], message : message});
    });
});
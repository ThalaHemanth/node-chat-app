const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const { generateMessage } = require('./utils/message');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New User Connected');
  socket.emit('newMessage', generateMessage('Admin','Welcome to chat Room'));

  socket.broadcast.emit('newMessage', generateMessage('Admin','new User Connected'))
  socket.on('createMessage', (message,callback) => {
    console.log('createMessage',message);
    io.emit('newMessage', generateMessage(message.from,message.text));
    callback();
    // socket.broadcast.emit('newMessage', {
    //   from: message.from,
    //   text: message.text,
    //   createdAt: new Date().getTime()
    // });
  });

  socket.on('disconnect', () => {
    console.log("Client Disconnected");
  });
});

server.listen(port, () => {
  console.log(`Express Server Running on ${port}`);
});

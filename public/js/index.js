  const socket = io();

  socket.on('connect', function () {
    console.log('Connected to server');

    socket.emit('createMessage', {
      from: 'Finch',
      text: 'India is Incredible'
    });
  });

    socket.on('newMessage', function(message) {
    console.log('New Message',message);
  });


  socket.on('disconnect', function () {
    console.log('Disconnected from the server');
  });

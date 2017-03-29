  const socket = io();
  function scrollToBottom () {
    //selectors
    var messages = $('#messages');
    var newMessage = messages.children('li:last-child');
    //heights
    var clientHeight = messages.prop('clientHeight');
    var scrollTop = messages.prop('scrollTop');
    var scrollHeight = messages.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight();
    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
      messages.scrollTop(scrollHeight);
    }
  };
  socket.on('connect', function () {
    console.log('Connected to server');
  });

  socket.on('disconnect', function () {
    console.log('Disconnected from the server');
  });

  socket.on('newMessage', function(message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    // var li = $('<li></li>');
    // li.text(`${message.from} ${formattedTime}: ${message.text}`);
    //
    // $('#messages').append(li);
    if(message.text.length < 1) {
      return
    }
    var template = $('#message-template').html();
    var html = Mustache.render(template,{
      text: message.text,
      from: message.from,
      createdAt: formattedTime
    });

    $('#messages').append(html);
    scrollToBottom();
  });

  socket.on('newLocationMessage', function(message) {
    var formattedTime = moment(message.createdAt).format('h:mm a');
    // var li = $('<li></li>');
    // var a = $('<a target=_blank>My Current Location </a>');
    // li.text(`${message.from} ${formattedTime}:`);
    // a.attr(`href`,message.url);
    // li.append(a);
    // $('#messages').append(li);
    var template = $('#location-message-template').html();
    var html = Mustache.render(template,{
      text: message.text,
      from: message.from,
      createdAt: formattedTime
    });
    $('#messages').append(html);
    scrollToBottom();
  });

$('#message-form').on('submit', function(e) {
  e.preventDefault();
  var messageTextbox = $('[name=message]');
  socket.emit('createMessage', {
    from: 'User',
    text: messageTextbox.val()
  }, function() {
      messageTextbox.val('')
  });
});

var locationButton = $('#send-location');

locationButton.on('click', function() {

  if(!navigator.geolocation) {
    return alert('Geolocation Not Supported');
  }

  locationButton.attr('disabled','disabled').text('Sending Location');

  navigator.geolocation.getCurrentPosition(function (position) {
    locationButton.removeAttr('disabled').text('Send Location');
    socket.emit('createLocation', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  }, function() {
    locationButton.removeAttr('disabled').text('Send Location');
  });
});

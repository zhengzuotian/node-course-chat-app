var socket = io();

socket.on('connect', function(){
  console.log('Connected to server');

  // socket.emit('createMessage', {
  //   to: 'jen@example.com',
  //   text: 'Hey. This is from me.'
  // });
});

socket.on('disconnect', function(){
  console.log('Disconnected from server');
});

socket.on('newMessage', function(message){
  console.log('New message', message);
  var li = jQuery('<li></li>');
  li.text((`${message.from}: ${message.text}`));

  jQuery('#messages').append(li);
});


socket.on('newLocationMessage', function(message){
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My current location</a>');

  li.text((`${message.from}: `));
  a.attr('href', message.url);
  li.append(a);

  jQuery('#messages').append(li);
});


// socket.emit('createMessage', {
//   from: 'Frank',
//   text: 'Hi'
// }, function(data){
//   console.log('Got it', data);
// });

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();
  var text = jQuery('[name=message]').val()
  socket.emit('createMessage', {
    from: 'User',
    text
  }, function(){
    var li = jQuery('<li></li>');
    li.text((`User: ${text}`));

    jQuery('#messages').append(li);
  });
});

var locationBtn =jQuery('#send-location');
locationBtn.on('click', function(){
  if(!navigator.geolocation){
    return alert('Geolocation not supported by your browser.');
  }

  navigator.geolocation.getCurrentPosition(function(position){
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function(){
    alert('Unable to fetch location.')
  });
});

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
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var li = jQuery('<li></li>');
  li.text((`${message.from} ${formattedTime}: ${message.text}`));

  jQuery('#messages').append(li);
});


socket.on('newLocationMessage', function(message){
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My current location</a>');

  li.text((`${message.from} ${formattedTime}: `));
  a.attr('href', message.url);
  li.append(a);

  jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function (e) {
  e.preventDefault();
  var textBox = jQuery('[name=message]');
  var text = textBox.val();
  socket.emit('createMessage', {
    from: `User`,
    text
  }, function(){
    textBox.val('');
  });
});

var locationBtn =jQuery('#send-location');
locationBtn.on('click', function(){
  if(!navigator.geolocation){
    return alert('Geolocation not supported by your browser.');
  }

  locationBtn.prop('disabled', true).text('Send location...');

  navigator.geolocation.getCurrentPosition(function(position){
    locationBtn.prop('disabled', false).text('Send location');
    socket.emit('createLocationMessage', {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    });
  }, function(){
    locationBtn.prop('disabled', false).text('Send location');
    alert('Unable to fetch location.');
  });
});

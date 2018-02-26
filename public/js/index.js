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
  var template = jQuery('#message-template').html();
  var html = Mustache.render(template, {
    text: message.text,
    from: message.from,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
});


socket.on('newLocationMessage', function(message){
  var formattedTime = moment(message.createdAt).format('h:mm a');
  var template = jQuery('#location-template').html();
  var html = Mustache.render(template, {
    href: message.url,
    from: message.from,
    createdAt: formattedTime
  });

  jQuery('#messages').append(html);
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

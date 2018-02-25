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

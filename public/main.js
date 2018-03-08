var socket;
$(document).ready(init);

function init() {
  socket = io();
  socket.on('chat message', receiveMessage);
}

function sendMessage(){
  socket.emit('chat message', $('#m').val());
  $('#m').val('');
  return false;
  }

function receiveMessage(msg){
  $('#messages').append($('<li>').text(msg));
  window.scrollTo(0, document.body.scrollHeight);
  }

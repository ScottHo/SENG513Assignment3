var socket;
$(document).ready(init);

function init() {
  socket = io();
  socket.on('chat message', receiveMessage);
  socket.on('user list', userList)
  socket.on('new user', newUser);
  socket.on('exit user', exitUser);

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

function userList(users){
  for (i = 0; i < users.length; i++) {
    $('#users').append($('<li>').text(users[i]));
  }
}

function newUser(username){
  $('#users').append($('<li>').text(username));
}

function exitUser(username){
  for (let element of document.getElementById("users").childNodes){
    if (element.innerText == username){
      document.getElementById("users").removeChild(element);
      return
    }
  }
}

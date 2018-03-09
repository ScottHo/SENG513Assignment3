var socket;
var currentUser;
$(document).ready(init);

function init() {
  socket = io();
  socket.on('chat message', receiveMessage);
  socket.on('setup', setup);
  socket.on('new user', newUser);
  socket.on('exit user', exitUser);
  socket.on('change name', changeName)
}

function sendMessage(){
  socket.emit('chat message', $('#m').val(), currentUser);
  $('#m').val('');
  return false;
  }

function receiveMessage(msg, user, d){
  var date = new Date(d);
  var dateString = "[" + date.getDate() + "/"
                + (date.getMonth()+1)  + "/"
                + date.getFullYear() + " "
                + date.getHours() + ":"
                + date.getMinutes() + ":"
                + date.getSeconds() + "] ";
  var userString = user + ": ";
  $('#messages').append($('<li>').text(dateString + userString + msg));
  window.scrollTo(0, document.body.scrollHeight);
  }

function setup(users, _currentUser){
  for (i = 0; i < users.length; i++) {
    $('#users').append($('<li>').text(users[i]));
  }
  currentUser = _currentUser;
  document.getElementById("user").innerHTML = currentUser;
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

function changeName(oldName, newName){
  for (let element of document.getElementById("users").childNodes){
    if (element.innerText == oldName){
      document.getElementById("users").removeChild(element);
      $('#users').append($('<li>').text(newName));
      currentUser = newName;
      document.getElementById("user").innerHTML = currentUser;
      return
    }
  }
}

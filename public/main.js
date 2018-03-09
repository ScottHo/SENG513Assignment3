var socket;
var currentUser;
var currentColor = "00ff00";
$(document).ready(init);

function init() {
  socket = io();
  socket.on('chat message', receiveMessage);
  socket.on('setup', setup);
  socket.on('new user', newUser);
  socket.on('exit user', exitUser);
  socket.on('change name', changeName);
  socket.on('server message', serverMessage);
  socket.on('color change', colorChange);
}

function sendMessage(){
  socket.emit('chat message', $('#m').val(), currentUser, currentColor);
  $('#m').val('');
  return false;
  }

function receiveMessage(msg, user, color, d){
  var date = new Date(d);
  var dateString = "[" + date.getDate() + "/"
                + (date.getMonth()+1)  + "/"
                + date.getFullYear() + " "
                + date.getHours() + ":"
                + date.getMinutes() + ":"
                + date.getSeconds() + "] ";
  console.log(color);
  var userString = "<span style=\"color: #" + color + ";\">" + user + "</span>: ";
  if (user == currentUser){
    $('#messages').append($('<li><p><b>' + dateString + userString +
                          msg + '</b></p></li>'));
    socket.emit('add history', '<li><p>' + dateString + userString +
                          msg + '</p></li>')
    }
  else{
    $('#messages').append($('<li><p>' + dateString + userString +
                          msg + '</p></li>'));
    }
  window.scrollTo(0, document.body.scrollHeight);
  }

function setup(users, _currentUser, history){
  for (i = 0; i < users.length; i++) {
    $('#users').append($('<li>').text(users[i]));
  }
  currentUser = _currentUser;
  document.getElementById("user").innerHTML = currentUser;
  document.getElementById("color").innerHTML = currentColor;
  for(let line of history){
    $('#messages').append(line);
  }
}

function newUser(username){
  $('#users').append($('<li>').text(username));
}

function exitUser(username){
  for (let element of document.getElementById("users").childNodes){
    if (element.innerText === username){
      document.getElementById("users").removeChild(element);
      return
    }
  }
}

function changeName(oldName, newName){
  for (let element of document.getElementById("users").childNodes){
    if (element.innerText === oldName){
      document.getElementById("users").removeChild(element);
      $('#users').append($('<li>').text(newName));
      if (currentUser === oldName){
        currentUser = newName;
        document.getElementById("user").innerHTML = currentUser;
      }
      return
    }
  }
}

function serverMessage(msg, d){
  var date = new Date(d);
  var dateString = "[" + date.getDate() + "/"
                + (date.getMonth()+1)  + "/"
                + date.getFullYear() + " "
                + date.getHours() + ":"
                + date.getMinutes() + ":"
                + date.getSeconds() + "] ";
  $('#messages').append($("<li><p><b><span style=\"color: #CC0000;\">" + dateString + "SERVER: " +
                        msg + "</span></b></p></li>"));
}

function colorChange(color){
  currentColor = color;
  document.getElementById("color").innerHTML = currentColor;
}

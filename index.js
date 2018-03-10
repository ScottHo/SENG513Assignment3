/*  index.js
    server side Application of the chat app
*/

let express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var path = require('path');
var users = [];
var history = [];
for (i = 0; i < 200; i++) {
  history.push("<li>&nbsp;</li>");
} 
var userSockets = {};

app.get('/', function(req, res){
 res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use(express.static(path.join(__dirname, "public")));

io.on('connection', function(socket){
  var currentUser = createUser(socket);
  socket.emit('setup', users, currentUser, history);
  console.log(currentUser + " Connected.");
  socket.broadcast.emit('new user', currentUser);
  // Event handler for when a session ends.
  socket.on("disconnect", function() {
    console.log("disconnect");
    socket.broadcast.emit('exit user', currentUser);
    console.log(currentUser + " disconnected.");
    var index = users.indexOf(currentUser);
    if (index > -1) {
      users.splice(index, 1);
    }
  });
  socket.on('chat message', retrieveMessage);
  socket.on('add history', addHistory);
});

function addHistory(msg){
  history.push(msg);
  if (history.length > 200){
    history.shift();
  }
}

function retrieveMessage(msg, user, color){
  if (msg.substring(0,6) === "/nick "){
    var newName = msg.substring(6, msg.length);
    if (users.indexOf(newName) != -1){
      var d = new Date();
      userSockets[user].emit('server message', "Error: nickname " + newName + " is not unique", d);
      return;
    }
    else if (msg.length > 56){
      userSockets[user].emit('server message', "Error: nickname " + newName + " is too long (max 50 chars)", d);
      return;
    }

    userSockets[user].emit('server message', "Nickname changed to " + newName, d);
    io.emit('change name', user, newName);
    var index =  users.indexOf(user);
    users[index] = newName;
  }
  else if (msg.substring(0,11) === "/nickcolor "){
    var newColor = msg.substring(11, msg.length);
    if (isColor(newColor)){
      userSockets[user].emit('color change', newColor);
      userSockets[user].emit('server message', "Nickname Color changed", d);
    }
    else{
      userSockets[user].emit('server message', "Error: color " + newColor + " is not valid", d);
    }
  }
  else{
    var d = new Date();
    io.emit('chat message', msg, user, color, d);

  }
}

function createUser(_socket){
  var number = 1;
  while(users.indexOf("user" + number.toString()) != -1){
    number++;
  }
  var newUser = "user" + number.toString();
  users.push(newUser);
  userSockets[newUser] = _socket;
  return newUser;
}

function isColor(color){
  if (color.length !== 6)
    return false;
  var re = /[0-9A-Fa-f]{6}/g;
  if(re.test(color)) {
    return true;
  }
  else {
    return false;
  }
}

http.listen(port, function(){
  console.log('listening on *:' + port);
});

/*  index.js
    server side Application of the chat app
*/

let express = require("express");
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var path = require('path');
var available = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
var users = [];
var User = class {
  constructor(name, number){
    this._name = name;
    this._number = number;
  }
  get name(){
    return this._name;
  }
  get number(){
    return this._number;
  }
  set name(newname){
    this._name = newname;
  }
}

app.get('/', function(req, res){
 res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use(express.static(path.join(__dirname, "public")));

io.on('connection', function(socket){
  var currentUser = createUser();
  socket.emit('setup', users, currentUser.name);
  console.log(currentUser.name + " Connected.");
  socket.broadcast.emit('new user', currentUser.name);
  // Event handler for when a session ends.
  socket.on("disconnect", function() {
    console.log("disconnect");
    socket.broadcast.emit('exit user', currentUser.name);
    available.push(currentUser.number);
    console.log(currentUser.name + " disconnected.");
    var index = users.indexOf(currentUser.name);
    if (index > -1) {
      users.splice(index, 1);
    }
  });

  socket.on('chat message', retrieveMessage);
});

function retrieveMessage(msg, user){
  if (msg.substring(0,6) == "/nick "){
    var newName = msg.substring(6, msg.length);
    if (users.indexOf(newName) != -1){
      var d = new Date();
      io.emit('chat message', "Error: nickname is not unique", "SERVER", d);
      return;
    }
    var index =  users.indexOf(user);
    if (index > -1) {
      users.splice(index, 1);
    }
    users.push(newName);
    io.emit('change name', user, newName);
  }
  else{
    var d = new Date();
    io.emit('chat message', msg, user, d);
  }
}

function createUser(){
  var number = available.pop();
  var newUser = new User("user" + number.toString(), number);
  users.push(newUser.name);
  return newUser;
}

http.listen(port, function(){
  console.log('listening on *:' + port);
});

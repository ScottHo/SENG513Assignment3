var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;
var path = require('path');

app.get('/', function(req, res){
 res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.use(express.static(path.join(__dirname, "public")));

io.on('connection', function(socket){
  console.log("New User.");

  // Event handler for when a session ends.
  socket.on("disconnect", function() {
    console.log("user disconnected.");
    });

  socket.on('chat message', function(msg){
    console.log("attempt to send :" + msg);
    io.emit('chat message', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});

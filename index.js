var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});

io.on('connection', function(socket){
  socket.on('newmsg', function(msg, pid){
    io.emit('newmsg', '<a style="color:red>"' + guser(pid).rank + '</a> ' + guser(pid).name + ': ' + msg);
  });
  socket.on('original-setup', function(name){
    var newpid = Math.floor(Math.random() * 100000000000000000);
    wuser(new user(newpid, socket.id, name, '0', ''), newpid);
    io.to(socket.id).emit('newpid', newpid);
  });
  socket.on('regular-setup', function(pid){
    wuser('same', socket.id, 'same', 'same', 'same');
  });
});

function user(pid, tid, name, muted, rank){
  this.pid = pid;
  this.tid = tid;
  this.name = name;
  this.muted = muted;
  this.rank = rank;
}

function wuser(user, pid){
  var editableUser = user;
  if (editableUser.pid === 'same'){
    editableUser.pid = pid;
  }
  if (editableUser.tid === 'same'){
    editableUser.tid = JSON.parse(localStorage.getItem('user-' + pid)).tid;
  }
  if (editableUser.name === 'same'){
    editableUser.name = JSON.parse(localStorage.getItem('user-' + pid)).name;
  }
  if (editableUser.muted === 'same'){
    editableUser.muted = JSON.parse(localStorage.getItem('user-' + pid)).muted;
  }
  if (editableUser.rank === 'same'){
    editableUser.rank = JSON.parse(localStorage.getItem('user-' + pid)).rank;
  }
  localStorage.setItem('user-' + pid, JSON.stringify(editableUser));
}

function guser(pid){
  return JSON.parse(localStorage.getItem('user-' + pid))
}

/**
 * 通过socket.io可以轻松解决聊天中的各种API，如XXX加入群聊实时通知、用户列表实时更新、群聊数实时更新、XXX退出群聊实时通知
 */
var express = require('express')();
var app = require('http').Server(express);
var io = require('socket.io')(app);
app.listen(9000);

let userId = 0;

express.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

// 连接监听
io.on('connection', function (socket) {

  userId++;
  socket.userId = userId;
  // 广播，包括自己
  io.emit("notice", {
    userId
  });

  // 接收数据事件
  socket.on('receive', function (data) {
    console.log("from client data:", data);
    // 发送数据
    io.emit('send', {
      data: data.data,
      userId: socket.userId,
    });

  });

  // 断开连接事件
  socket.on("disconnect", function () {
    // 退出
    io.emit('exit', {
      userId: socket.userId,
    })
  })
});

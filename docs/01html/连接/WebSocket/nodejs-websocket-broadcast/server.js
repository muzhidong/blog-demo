const ws = require("nodejs-websocket");

const PORT = 8889;
const TYPE = {
  ENTER: 0,
  LEAVE: 1,
  MESSAGE: 2,
}
let userId = 0;

function broadcast(msg) {
  server.connections.forEach((item) => {
    item.send(JSON.stringify(msg));
  });
}

const server = ws.createServer((connect) => {
  console.log("ws server connect...");

  userId++;
  connect.userId = userId;
  broadcast({
    type: TYPE.ENTER,
    msg: `用户${connect.userId}进入了聊天室`,
    time: new Date().toLocaleDateString(),
  });

  connect.on("text", (data) => {
    console.log(data);
    broadcast({
      type: TYPE.MESSAGE,
      msg: `用户${connect.userId}发送了一条消息：${data}`,
      time: new Date().toLocaleDateString(),
    });
  });

  connect.on("close", () => {
    console.log("ws server close...");
    broadcast({
      type: TYPE.LEAVE,
      msg: `用户${connect.userId}离开了聊天室`,
      time: new Date().toLocaleDateString(),
    });
  });

  connect.on("error", (err) => {
    console.log("ws server error...", err);
  })
});

server.listen(PORT, () => {
  console.log("ws server is listening in ", PORT);
});


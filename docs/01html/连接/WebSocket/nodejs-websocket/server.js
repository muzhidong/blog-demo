const ws = require("nodejs-websocket");
// 服务器端口号
const PORT = 8888;
// 创建WS服务器
const server = ws.createServer((connect) => {
  // 每当连接时触发该回调，给当前用户创建一个connect对象
  console.log("ws server connect...");
  
  // 收到客户端数据时触发
  connect.on("text", (data) => {
    console.log(data);
    connect.send("我是服务端那边过来的数据，神不神奇？" + data);
  });
  
  // 连接关闭
  connect.on("close", () => {
    console.log("ws server close...");
  });
  
  // 连接错误
  connect.on("error", (err) => {
    console.log("ws server error...", err);
  })
});
// 启动WS服务器
server.listen(PORT, () => {
  console.log("ws server is listening in", PORT);
})

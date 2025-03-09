var http = require('http');
var fs = require('fs');

function callback(req, res) {

  // 允许跨域
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers','Content-Type,Content-Length, Authorization, Accept,X-Requested-With')
  res.setHeader('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')

  // 预检请求直接返回200
  if (req.method == 'OPTIONS'){
    res.write(200);
    res.end();
    return;
  }

  // 获取路径
  var homePage = './index.html';
  var path = req.url === '/' ? homePage: req.url;

  // 处理/test路径请求
  if (path === '/test') {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    });
    
    res.write('retry:10000 \n');
    res.write(`data:${new Date()} \n\n`);
    
    // 每隔1秒发送一条信息
    var timer = setInterval(() => {
      res.write(`data:${new Date()} \n\n`);
    }, 1000);

    req.connection.addListener('close', function() {
      clearInterval(timer);
      timer = null;
    }, false);

    return;
  }

  // 处理/路径请求
  if(path === homePage){
    fs.exists(path, function(isExist) {
      if(isExist) {
        fs.readFile(path, function(err, content) {
          if(err) {
            res.writeHead(500);
            res.end();
          } else {
            res.writeHead(200, {
              "Content-Type": "text/html",
            })
            res.end(content, 'utf-8');
          }
        })
      } else {
        res.writeHead(404);
        res.end();
      }
    })
    return;
  }

  // 其他路径请求
  res.writeHead(404);
  res.end();
}

http.createServer(callback).listen(8080, '127.0.0.1');

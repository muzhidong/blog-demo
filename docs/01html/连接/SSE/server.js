var http = require('http');
var fs = require('fs');

var index = './client.html';
var fileName;
var timer;

function callback(req, res) {
  // 获取路径
  if(req.url === '/') {
    fileName = index;
  } else {
    fileName = `.${req.url}`;
  }

  // 允许跨域
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Headers','Content-Type,Content-Length, Authorization, Accept,X-Requested-With')
  res.setHeader('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  // res.setHeader('X-Powered-By', ' 3.2.1')

  if (req.method == 'OPTIONS'){
    res.write(200);
    res.end();
    return;
  }

  // 处理/test路径请求
  if(fileName === './test'){
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "Connection": "keep-alive"
    });
    
    res.write('retry:10000 \n');
    res.write(`data:${new Date()} \n\n`);
    
    // 每隔1秒发送一条信息
    timer = setInterval(() => {
      res.write(`data:${new Date()} \n\n`);
    }, 1000);

    req.connection.addListener('close',function(){
      clearInterval(timer);
      timer = null;
    },false);

    return;
  }

  // 处理/路径请求
  if(fileName === index){
    fs.exists(fileName,function(exists) {
      if(exists) {
        fs.readFile(fileName, function(err, content) {
          if(err) {
            res.writeHead(500);
            res.end();
          } else {
            res.writeHead(200,{
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

  res.writeHead(404);
  res.end();
}

http.createServer(callback).listen(8080, '127.0.0.1');

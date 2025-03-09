// 注册消息接收事件，实现消息互通
function print() { 
	var that = self;
	console.group('DedicatedWorkerGlobalScope对象提供如下属性或方法');
	for(let key in that){
		console.log(typeof that[key], key, that[key]);
	}
	console.groupEnd();
}
print()

onmessage = function (e) {
	console.log(e.data);
	postMessage('worker: Window 你好，我是Web Worker');
	postMessage('worker: ByeBye');
};


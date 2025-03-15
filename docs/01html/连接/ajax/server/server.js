var http = require("http");
var url = require("url");
var qs = require('querystring');

const route = function(path) {
	console.log(`api:${path}`)
	switch (path) {
		case '/test':
			return {
				data: {
					fruits: ['apple', 'pear', 'watermelon']
				},
				message: 'success',
			};
		default:
			break;
	}
}

const handleGet = function ({api, query, res}) {
	let params = qs.parse(decodeURI(query));
	params = {
		...params
	}
	console.log('get', params);

	var result = route(api);
	res.setHeader('Content-Type', 'application/json;charset=UTF-8');
	res.statusCode = 200;
	res.end(JSON.stringify(result));
}

const handlePost = ({ api, req, res }) => {
	let params = "";
	req.on("data", function(value) {
		params += value;
	});
	req.on("end", function() {
		params = JSON.parse(params);
		console.log('post', params);

		var result = route(api);
		res.setHeader('Content-Type', 'application/json;charset=UTF-8');
		res.statusCode = 200;
		res.end(JSON.stringify(result));
	});
}

const handleRequest = function(req, res) {
	const {
		headers: {
			origin,
			Origin,
			referer,
			Referer,
		},
		method
	} = req;

	res.setHeader("Access-Control-Allow-Origin", origin || Origin || referer || Referer || '*');
	// X-Requested-With为null则为同步请求，为XMLHttpRequest则为异步请求
	res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
	res.setHeader("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
	res.setHeader("Access-Control-Allow-Credentials", true);

	const { 
		pathname: api,
		query
	} = url.parse(req.url);

	switch (method.toLowerCase()) {
		case 'get':
			handleGet({api, query, res});
			break;
		case 'post':
			handlePost({api, req, res});
			break;
		case 'options':
			res.statusCode = 200;
			res.end();
			break;
	}

	req.on("close", function() {
		console.log(`request is closed, whose method is ${method} and url is ${api}`);
	});
}

function startServer(port) {

	const server = http.createServer();

	server.listen(port, "127.0.0.1", () => {
		console.log(`server is started on port ${port}`)
	});

	server.on('request', handleRequest);

	server.on("error", (e) => {
		if (e.code == 'EADDRINUSE') {
			console.log("server port is occupied, please change another port");
		}
	});

	server.on("timeout", () => {
		console.log("server is timeout")
	});

	server.on("close", () => {
		console.log("server is closed");
	});

};

startServer(9008);

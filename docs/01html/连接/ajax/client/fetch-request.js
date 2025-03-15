(function(context) {

	if (!(/^\[object (?:Window|DOMWindow|global)\]$/.test(toString.call(context)))) return;

	function isArray(value) {
		return toString.call(value) === '[object Array]';
	}

	function isObject(value) {
		return toString.call(value) === '[object Object]';
	}

	function toSafeQueryString(obj) {

		if (!isObject(obj)) return;

		let qs = '?';
		let val;
		for (let key in obj) {
			val = obj[key];
			if (isObject(val) || isArray(val)) {
				val = encodeURIComponent(JSON.stringify(val));
			} else if (val === void 0) {
				continue;
			} else {
				val = encodeURIComponent(val);
			}
			qs += key + "=" + val + "&";
		}

		return qs.substring(0, qs.length - 1);

	}

	// function toFormData(jsonData) {
	// 	var fd = new FormData();
	// 	for (var key in jsonData) {
	// 		fd.append(key, jsonData[key]);
	// 	}
	// 	return fd;
	// }

	function request(method, url, params, option = {}) {

		let opts = {
			method,
			dataType: 'json',
			headers: {
				"Content-Type": "application/json;charset=UTF-8"
			},
			...option,
		}

		switch (method.toLowerCase()) {
			case 'get':
				url += toSafeQueryString(params);
				break;
			case 'post':
				opts.body = JSON.stringify(params);
				break;
		}

		return fetch(url, opts).then(res => {
			// 返回一个Response对象，此时还不能直接去取响应内容
			if (res.status === 200) {
				return res.json();
			} else if (res.status >= 300 && res.status < 400) {
				console.log('重定向操作');
				Promise.resolve();
			} else if (res.status >= 400 && res.status < 500) {
				console.log('客户端错误，错误信息为', res.statusText);
				Promise.reject();
			} else if (res.status >= 500) {
				console.log('服务端出问题了');
				Promise.reject();
			}
		}, err=>{
			console.log('网络好像出了点问题',err.message);
		});
	}

	context.request = request;

})(window);

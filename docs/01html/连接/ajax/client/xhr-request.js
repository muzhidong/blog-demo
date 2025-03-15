// TODO:
// 支持put、delete请求方式；
// 支持上传下载，监听进度onprogress；
// 监听超时ontimeout；
// 监听错误onerror；
// 用onload替代onreadystatechange?
(function(context) {

  if (!(/^\[object (?:Window|DOMWindow|global)\]$/.test(toString.call(context)))) return;

  function isArray(value) {
    return toString.call(value) === '[object Array]';
  }

  function isObject(value) {
    return toString.call(value) === '[object Object]';
  }

  function toSafeQueryString(obj) {

    if (!isObject(obj)) return '';

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

  function getXmlHttpRequest() {
    let xmlhttp;
    if (window.XMLHttpRequest) {
      xmlhttp = new XMLHttpRequest();
    } else {
      xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
    }
    return xmlhttp;
  }

  function setHeader(headers) {
    if(!Object.keys(headers).some((header) => header.toLowerCase() === "content-type")) {
      xmlHttpRequest.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    }
    for (let key in headers) {
      xmlHttpRequest.setRequestHeader(key, headers[key]);
    }
  }

  function response(res, resolve, reject) {
    res = res.target || res.currentTarget;
    if (res.readyState === 4) {
      if (res.status === 200) {
        try {
          resolve(JSON.parse(res.response));
        } catch (e) {
          resolve(res.response);
        }
      } else if (res.status >= 300 && res.status < 400) {
        console.log('重定向操作');
        try {
          resolve(JSON.parse(res.response));
        } catch (e) {
          resolve(res.response);
        }
      } else if (res.status >= 400 && res.status < 500) {
        console.log(`客户端错误，响应码为${res.status}，响应内容为${res.statusText}`);
        reject();
      } else if (res.status >= 500) {
        console.log(`服务端出问题了，响应码为${res.status}，响应内容为${res.statusText}`);
        reject();
      }
    }
  }

  let xmlHttpRequest;

  function Request() {
    xmlHttpRequest = getXmlHttpRequest();
  }

  Request.prototype.get = function(url, data, header = {}) {
    return new Promise((resolve, reject) => {
      xmlHttpRequest.open('get', `${url}${toSafeQueryString(data)}`);
      setHeader(header);
      xmlHttpRequest.onreadystatechange = function(res) {
        response(res, resolve, reject);
      }
      xmlHttpRequest.send();
    })
  }

  Request.prototype.post = function(url, data, header = {}) {
    return new Promise((resolve, reject) => {
      xmlHttpRequest.open('post', url);
      setHeader(header);
      xmlHttpRequest.onreadystatechange = function(res) {
        response(res, resolve, reject);
      }
      xmlHttpRequest.send(JSON.stringify(data));
    })
  }

  context.request = new Request();

})(window);

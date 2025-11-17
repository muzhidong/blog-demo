// 共享屏幕
var videoEl, btnEl;
function initSharingScreenAndRecording(){
  videoEl = document.createElement('video');
  videoEl.id = 'capture';
  videoEl.controls = 'true';
  videoEl.style.border = '1px solid #333';
  videoEl.style.display = 'block';
  videoEl.addEventListener('loadedmetadata', function () {
    // 3、元数据加载完毕时播放视频
    this.play();
  })
  document.querySelector('#share').appendChild(videoEl);

  btnEl = document.createElement('button');
  btnEl.style.marginTop = '20px';
  btnEl.innerText = '共享屏幕';
  btnEl.addEventListener('click', function () { 
    var mediaDevices = navigator.mediaDevices;
    if (mediaDevices) {
      // 1、共享屏幕
      mediaDevices.getDisplayMedia({
        video: {
          width: 500,
          height: 500,
          cursor: 'always'
        },
        // 无法采集音频?
        audio: true
      }).then(onSuccess, onFail);
    } else {
      toast('当前版本不支持媒体设备API调用');
    }
  }, false);
  document.querySelector('#share').appendChild(btnEl);
}

function onSuccess(stream) {
  btnEl.disabled = true;
  // 2、绑定视频流对象
  // srcObject可以是MediaSource，也可以是MediaStream，都是支持的
  // console.log(stream instanceof MediaSource);
  // console.log(stream instanceof MediaStream);
  videoEl.srcObject = stream;
  stream.getVideoTracks()[0].addEventListener('ended', () => {
    btnEl.disabled = false;
    toast('用户结束屏幕共享', 'bottom');
    // 用于录屏	
    btnStartOrStop.disabled = true;
  })

  // 用于录屏
  initRecord(stream);
}

function onFail(err) {
  toast(`getDisplayMedia error: ${err.name} ${err.message}`, 'bottom');
}

function toast(text, pos = 'middle') {
  var divEl;
  divEl = document.querySelector('#toast');
  if (!divEl) {
    divEl = document.createElement('div');
    divEl.id = 'toast';
    divEl.style.position = 'fixed';
    if(pos === 'middle'){
      divEl.style.top = '50%';
      divEl.style.height = '150px';
    }else if(pos === 'bottom'){
      divEl.style.bottom ='20px';
    }
    divEl.style.left = '50%';
    divEl.style.transform = 'translate(-50%, -50%)';
    divEl.style.width = '300px';
    divEl.style.padding = '20px';
    divEl.style.textAlign = 'center';
    divEl.style.backgroundColor = '#333';
    divEl.style.color = 'white';
    divEl.style.borderRadius = '10px';
    divEl.style.boxSizing = 'border-box';
    document.body.appendChild(divEl);
  }
  divEl.style.display = 'block';
  divEl.innerText = text;
  setTimeout(function () {
    divEl.style.display = 'none';
  }, 3000)
}

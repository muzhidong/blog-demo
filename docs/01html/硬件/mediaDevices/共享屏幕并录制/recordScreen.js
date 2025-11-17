// 录屏
var recordVideoEl = document.querySelector('#record');
var btnStartOrStop = document.querySelector('#btnStartOrStop');
var btnPauseOrResume = document.querySelector('#btnPauseOrResume');
var isRecording = false;
var mediaRecorder;
// var buffer;
// var mimeType = 'video/webm; codecs="vp8"'
// var mimeType = 'video/mp4; codecs="avc1.42E01E, mp4a.40.2"'

btnStartOrStop.disabled = true;
btnPauseOrResume.disabled = true;

// if("MediaSource" in window) {
//   // 创建媒体源
//   var mediaSource = new MediaSource();
//   // 监听sourceopen事件，用于创建sourceBuffer并监听其updateend事件
//   mediaSource.addEventListener('sourceopen', (e) => {
//     buffer = mediaSource.addSourceBuffer(mimeType);
//     // 触发时机见https://developer.mozilla.org/en-US/docs/Web/API/SourceBuffer#events
//     // 1、调用SourceBuffer.appendBuffer方法后
//     // 2、调用SourceBuffer.remove方法后
//     // 这里是第一种情况
//     buffer.addEventListener('updateend', (event) => {
//       // 关闭媒体流，播放录制的视频
//       mediaSource.endOfStream();
//       recordVideoEl.play();
//     });
//   });
//   // 视频源绑定媒体源url
//   recordVideoEl.src = URL.createObjectURL(mediaSource);
// }

btnStartOrStop.addEventListener('click', function(){
  if(!isRecording){
    // 开始录屏
    mediaRecorder.start();
    isRecording = true;
    btnPauseOrResume.disabled = false;
    btnStartOrStop.innerText = "停止"
    return;
  }
  // 停止录屏
  mediaRecorder.stop();
  isRecording = false;
  btnPauseOrResume.disabled = true;
  btnStartOrStop.innerText = "开始"
}, false);

btnPauseOrResume.addEventListener('click', function(){
  if(isRecording){
    // 暂停或继续录屏
    if(mediaRecorder.state === "recording"){
      mediaRecorder.pause();
      btnPauseOrResume.innerText = "继续"
    } else {
      mediaRecorder.resume();
      btnPauseOrResume.innerText = "暂停"
    }
  }
}, false);

function initRecord(stream){
  btnStartOrStop.disabled = false;

  mediaRecorder = new MediaRecorder(stream);
  // 触发时机见https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder/dataavailable_event
  // 1、录制器调用带有时间片参数的start方法时，根据时间片触发
  // 2、录制器调用requestData方法时触发(创建新的blob，继续捕获)
  // 3、录制器调用stop方法时触发(分发给当前的blob，停止捕获)
  // 4、媒体流结束
  // 这里是第三种情况。
  mediaRecorder.addEventListener("dataavailable", (e) => {
    // bindSourceData(e.data);
    recordVideoEl.src = URL.createObjectURL(e.data);
    recordVideoEl.addEventListener('loadedmetadata', function(){
      this.play();
    })
  });
}

// function bindSourceData(data){
//   // console.log(data instanceof Blob); // true
//   if(buffer) {
//     buffer.appendBuffer(data);
//   } else {
//     recordVideoEl.src = URL.createObjectURL(new Blob(data,{type: mimeType}))
//     recordVideoEl.addEventListener('loadedmetadata', function(){
//       this.play();
//     })
//   }
// }

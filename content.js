function getYouTubeVideo() {
  return document.querySelector('.html5-main-video');
}

function playPause() {
  const video = getYouTubeVideo();
  if (video) {
    if (video.paused) {
      video.play();
      console.log('视频已播放');
    } else {
      video.pause();
      console.log('视频已暂停');
    }
    
    chrome.runtime.sendMessage({
      type: 'youtube-status',
      status: video.paused ? 'paused' : 'playing'
    });
  }
}

function skipForward() {
  const video = getYouTubeVideo();
  if (video) {
    video.currentTime = Math.min(video.currentTime + 10, video.duration);
    console.log('快进10秒, 当前时间:', video.currentTime);
  }
}

function skipBackward() {
  const video = getYouTubeVideo();
  if (video) {
    video.currentTime = Math.max(video.currentTime - 10, 0);
    console.log('后退10秒, 当前时间:', video.currentTime);
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('收到命令:', message.action);
  
  switch (message.action) {
    case 'play-pause':
      playPause();
      break;
    case 'forward':
      skipForward();
      break;
    case 'backward':
      skipBackward();
      break;
    default:
      console.log('未知命令:', message.action);
  }
  
  sendResponse({ success: true });
});

console.log('YouTube控制扩展已加载');
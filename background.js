chrome.commands.onCommand.addListener(async (command) => {
  // 1. 优先查找当前窗口中活动的YouTube标签页
  let [activeTab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
    url: "*://*.youtube.com/*"
  });

  if (activeTab && activeTab.status === 'complete') {
    sendMessageToTab(activeTab, command);
    return;
  }

  // 2. 如果没有，查找正在播放音频的YouTube标签页
  let [audibleTab] = await chrome.tabs.query({
    audible: true,
    url: "*://*.youtube.com/*"
  });

  if (audibleTab && audibleTab.status === 'complete') {
    sendMessageToTab(audibleTab, command);
    return;
  }

  // 3. 最后，退回到查找任意一个YouTube标签页
  let [anyTab] = await chrome.tabs.query({
    url: "*://*.youtube.com/*"
  });

  if (anyTab && anyTab.status === 'complete') {
    sendMessageToTab(anyTab, command);
    return;
  }

  console.log('没有找到准备就绪的YouTube标签页');
});

async function sendMessageToTab(tab, command) {
  try {
    await chrome.tabs.sendMessage(tab.id, {
      action: command
    });
    console.log(`命令 "${command}" 已发送到标签页: ${tab.title}`);
  } catch (error) {
    console.error(`发送消息到标签页 ${tab.id} 失败:`, error);
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'youtube-status') {
    console.log('YouTube播放状态:', message.status);
  }
});
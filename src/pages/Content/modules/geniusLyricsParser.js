// 监听来自 popup 的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GET_LYRICS') {
    const lyrics = document.querySelector('.lyrics')?.textContent;
    sendResponse({ lyrics });
  }
}); 
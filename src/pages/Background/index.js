import { handleFetchSongInfo } from './api/geniusSongInfoApi';
import {
  handleExtractLyricsFromURL,
  handleFetchAvaLanguageUrl,
} from './api/offscreenManager';

console.log('This is the background page.');
console.log('Put the background scripts here.');

console.log('Background script is running');

// 处理消息的主函数
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Background received message:', message);

  // 由于 chrome.runtime.onMessage 不支持直接使用 async 函数
  // 我们需要返回 true 来表示会异步发送响应
  handleMessage(message, sendResponse).catch((error) => {
    console.error('Error handling message:', error);
    sendResponse({ error: error.message });
  });

  return true;
});

// 主消息处理函数
async function handleMessage(message, sendResponse) {
  switch (message.type) {
    case 'FETCH_LYRICS_FROM_URL':
      await handleExtractLyricsFromURL(message, sendResponse);
      break;

    case 'FETCH_LYRICS_PAGE':
      await handleFetchLyricsPage(message, sendResponse);
      break;

    case 'FETCH_SONG_INFO':
      await handleFetchSongInfo(message, sendResponse);
      break;

    case 'FETCH_AVAILABLE_LANG_URL':
      console.log('Received FETCH_AVAILABLE_LANG_URL request in background...');
      await handleFetchAvaLanguageUrl(message, sendResponse);
      break;

    default:
      console.error('Unknown message type:', message.type);
      sendResponse({ error: 'Unknown message type' });
  }

  // Indicate the response will be async
  return true;
}

// Get all lanagues

// 处理获取歌词页面的请求
async function handleFetchLyricsPage(message, sendResponse) {
  try {
    const { url } = message;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    sendResponse({ success: true, html });
  } catch (error) {
    console.error('Error fetching lyrics page:', error);
    sendResponse({ success: false, error: error.message });
  }
}

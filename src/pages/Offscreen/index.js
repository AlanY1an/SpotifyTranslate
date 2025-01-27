import { parseAvailableLanguages } from './functions/getAvailableLanguages';
import { extractLyricsFromHTML } from './functions/getLyricsFromTargetLanguage';

console.log('Offscreen script loaded');

// 消息监听器
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.target === 'offscreen' && message.type === 'EXTRACT_LYRICS') {
    try {
      const lyrics = extractLyricsFromHTML(message.html);
      sendResponse({ success: true, lyrics });
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
    return true; // Indicate that the response will be sent asynchronously
  }

  if (
    message.target === 'offscreen' &&
    message.type === 'FETCH_AVAILABLE_LANG_URL'
  ) {
    parseAvailableLanguages(message.url, sendResponse);
    return true; // Indicate that the response will be sent asynchronously
  }

  if (
    message.target === 'offscreen' &&
    message.type === 'FETCH_AVAILABLE_LANG_URL'
  ) {
    parseAvailableLanguages(message.url, sendResponse);
    return true;
  }
});

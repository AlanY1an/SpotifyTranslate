import { extractLyricsFromURL } from "./offscreenHelper";

console.log('This is the background page.');
console.log('Put the background scripts here.');


const GENIUS_API_URL = 'https://api.genius.com/search';
const GENIUS_API_TOKEN =
  'jp7bt2-o1O_KHoAjTQthUDNB4PidEUgxt0NlL-eZ8pMyQV6J6mqN-sXIF9rItBb0';

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

    case 'EXTRACT_LYRICS':
      await extractLyricsFromURL(message, sendResponse);
      break;

    case 'FETCH_SONG_INFO':
      await handleFetchSongInfo(message, sendResponse);
      break;

    case 'FETCH_LYRICS_PAGE':
      await handleFetchLyricsPage(message, sendResponse);
      break;

    default:
      sendResponse({ error: 'Unknown message type' });
  }
}

// 处理获取歌曲信息的请求
async function handleFetchSongInfo(message, sendResponse) {
  try {
    console.log('Fetching song info for:', message);
    const { trackName, artistName } = message;

    const lyricsUrl = await fetchGeniusLyricsUrl(trackName, artistName);
    console.log('Found lyrics URL:', lyricsUrl);

    sendResponse({ lyrics: lyricsUrl });
  } catch (error) {
    console.error('Error fetching lyrics URL:', error);
    sendResponse({
      lyrics: null,
      error: 'Lyrics URL not found or API error.',
    });
  }
}

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

// 从 Genius API 获取歌词 URL
async function fetchGeniusLyricsUrl(trackName, artistName) {
  const query = `${trackName} ${artistName}`;
  const response = await fetch(
    `${GENIUS_API_URL}?q=${encodeURIComponent(query)}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${GENIUS_API_TOKEN}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error(`API error: ${response.status} - ${response.statusText}`);
  }

  const data = await response.json();
  console.log('Response from Genius API:', data);

  if (data.response.hits.length > 0) {
    return data.response.hits[0].result.url;
  }

  throw new Error('No lyrics URL found.');
}

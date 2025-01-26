import { ensureOffscreenDocument } from "./offscreenHelper";

console.log('This is the background page.');
console.log('Put the background scripts here.');


const GENIUS_API_URL = 'https://api.genius.com/search';
const GENIUS_API_TOKEN =
  'jp7bt2-o1O_KHoAjTQthUDNB4PidEUgxt0NlL-eZ8pMyQV6J6mqN-sXIF9rItBb0';

console.log('Background script is running');

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log('Background received message:', message);

  if (message.type === "EXTRACT_LYRICS") {
    await ensureOffscreenDocument();
    chrome.runtime.sendMessage(
      { type: "EXTRACT_LYRICS", url: message.url },
      response => {
        sendResponse(response);
      }
    );
    return true; // Keep the message channel open
  }

  if (message.type === 'FETCH_SONG_INFO') {
    console.log('Fetching song info for:', message);
    const { trackName, artistName } = message;

    fetchGeniusLyricsUrl(trackName, artistName)
      .then((lyricsUrl) => {
        console.log('Found lyrics URL:', lyricsUrl);
        sendResponse({ lyrics: lyricsUrl });
      })
      .catch((error) => {
        console.error('Error fetching lyrics URL:', error);
        sendResponse({
          lyrics: null,
          error: 'Lyrics URL not found or API error.',
        });
      });

    return true;
  }

  if (message.type === 'FETCH_LYRICS_PAGE') {
    const { url } = message;

    fetch(url)
      .then((response) => response.text())
      .then((html) => {
        // 只返回 HTML 内容，让 content script 去解析
        sendResponse({ success: true, html });
      })
      .catch((error) => {
        sendResponse({ success: false, error: error.message });
      });

    return true;
  }

  sendResponse({ error: 'Unknown message type' });
});

// Fetch lyrics URL from Genius API
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
  } else {
    throw new Error('No lyrics URL found.');
  }
}

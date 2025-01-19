console.log('This is the background page.');
console.log('Put the background scripts here.');


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'lyricsExtract') {
    console.log('Received lyrics from content script:', message.lyrics);

    // process the lyrics data here


    // send response
    sendResponse({ success: true });
  }
});


const GENIUS_API_URL = 'https://api.genius.com/search';
const GENIUS_API_TOKEN =
  'jp7bt2-o1O_KHoAjTQthUDNB4PidEUgxt0NlL-eZ8pMyQV6J6mqN-sXIF9rItBb0';

console.log('Background script is running');

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'FETCH_LYRICS') {
    const { trackName, artistName } = message;

    fetchLyrics(trackName, artistName)
      .then((lyricsUrl) => {
        sendResponse({ lyrics: lyricsUrl }); // 将真实的歌词 URL 返回
      })
      .catch((error) => {
        console.error('Error fetching lyrics:', error);
        sendResponse({ lyrics: null, error: 'Lyrics not found or API error.' });
      });

    return true; // 告诉 Chrome 支持异步响应
  }
});

async function fetchLyrics(trackName, artistName) {
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
    throw new Error('No lyrics found.');
  }
}

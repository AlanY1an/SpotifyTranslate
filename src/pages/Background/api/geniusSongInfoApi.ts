const GENIUS_API_URL = 'https://api.genius.com/search';
const GENIUS_API_TOKEN =
  'o_c6SgajtvBGl4t_T4qr7WAMQFNyzxNSMZ14D3VmXMq1n1eCL6vAoWttCAQNJVc0';

// 处理获取歌曲信息的请求
export async function handleFetchSongInfo(message: any, sendResponse: any) {
  try {
    console.log('Fetching song info for:', message);
    const { trackName, artistName, targetLanguage } = message;

    const lyricsUrl = await fetchGeniusLyricsUrl(
      trackName,
      artistName,
      targetLanguage
    );
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

// 从 Genius API 获取歌词 URL
async function fetchGeniusLyricsUrl(
  trackName: any,
  artistName: any,
  targetLanguage: any
) {
  const query = `${trackName} ${artistName} ${targetLanguage}`;
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

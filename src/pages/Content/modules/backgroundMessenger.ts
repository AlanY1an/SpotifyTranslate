export async function fetchSongInfoFromGenius(
  songTitle: string,
  artistName: string,
  targetLanguage: string
): Promise<string | null> {
  console.log('Fetching song info from Genius via background...');
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type: 'FETCH_SONG_INFO',
        trackName: songTitle,
        artistName: artistName,
        targetLanguage: targetLanguage,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error(`Error: ${chrome.runtime.lastError.message}`);
          reject(`Error: ${chrome.runtime.lastError.message}`);
        } else if (response?.lyrics) {
          console.log(`Lyrics URL found: ${response.lyrics}`);
          resolve(response.lyrics);
        } else {
          const errorMessage = response.error || 'No song info found.';
          console.error(errorMessage);
          reject(errorMessage);
        }
      }
    );
  });
}

export async function fetchAvailableLanguagesUrl(songInfoUrl: any) {
  if (!songInfoUrl) {
    console.error('No song info URL available');
    return;
  }

  console.log('Sending request to background for available languages...');
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type: 'FETCH_AVAILABLE_LANG_URL',
        url: songInfoUrl,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error(
            'Error communicating with background:',
            chrome.runtime.lastError.message
          );
          reject(chrome.runtime.lastError.message);
        } else if (response?.error) {
          console.error('Error from background:', response.error);
          reject(response.error);
        } else {
          console.log(
            'Available languages received from background:',
            response.links
          );
          resolve(response.links || []);
        }
      }
    );
  });
}

export async function sendMessageToBackground(message: any): Promise<any> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        console.error(`Error: ${chrome.runtime.lastError.message}`);
        reject(`Error: ${chrome.runtime.lastError.message}`);
      } else {
        resolve(response);
      }
    });
  });
}

export async function fetchLyricsFromUrl(
  lyricsUrl: string
): Promise<string | null> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: 'FETCH_LYRICS_FROM_URL', url: lyricsUrl },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error(`Error: ${chrome.runtime.lastError.message}`);
          reject(`Error: ${chrome.runtime.lastError.message}`);
        } else {
          resolve(response.lyrics);
        }
      }
    );
  });
}

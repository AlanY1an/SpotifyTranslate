import {
  fetchAvailableLanguagesUrl,
  fetchLyricsFromUrl,
  fetchSongInfoFromGenius,
} from './modules/backgroundMessenger';
import { showLyricsTranslated } from './modules/translate';
import { getSongTitleAndArtist } from './modules/spotifyInfo';
import { setTranslatedSongObject, translatedSongObject } from './dataStore';

console.log('Content script works!!!!');
console.log('Must reload extension for modifications to take effect.');

var targetLanguage = 'English';

let extractedLyrics = [];
let allLanguages = [];
let trackInfo = [];

// 添加歌曲监听函数
const watchTrackChanges = () => {
  let previousTrack = null;
  let isProcessing = false;

  // 监听 Spotify 播放按钮变化
  const playButton = document.querySelector('[aria-label="暂停"]'); // 如果显示的是暂停，那么就是正在播放
  if (!playButton) {
    console.warn("Play button not found, polling for track changes instead.");
    setInterval(checkTrackChange, 3000);
    return;
  }

  const observer = new MutationObserver(() => {
    let playButton = document.querySelector('[data-testid="play-button"], [aria-label="暂停"], [aria-label="Pause"]');
    if (!playButton) {
      console.warn("Play button disappeared.");
      return;
    }
    checkTrackChange();
  });


  observer.observe(playButton, { attributes: true, attributeFilter: ["aria-label"] });

  async function checkTrackChange() {
    if (isProcessing) return;

    let playButton = document.querySelector('[aria-label="暂停"], [aria-label="Pause"]'); // 重新获取
    if (!playButton) {
      // console.warn("Player is paused or play button not found.");
      return;
    }

    const currentTrack = await getSongTitleAndArtist();
    if (!currentTrack) return;

    if (!isProcessing && !previousTrack || currentTrack[0] !== previousTrack[0] || currentTrack[1] !== previousTrack[1]) {
      isProcessing = true;

      try {
        console.log("Track changed, updating lyrics...");
        previousTrack = [...currentTrack];

        const [songTitle, artist] = currentTrack;
        const songInfoUrl = await fetchSongInfoFromGenius(songTitle, artist, targetLanguage);
        if (songInfoUrl) {
          extractedLyrics = await fetchLyricsFromUrl(songInfoUrl);
          setTranslatedSongObject({ meta: { title: songTitle, artist }, lyrics: extractedLyrics });

          console.log('Translated Song Object stored:', translatedSongObject);

          showLyricsTranslated();
        }
      } catch (error) {
        console.error("Failed to fetch or process song info:", error);
      } finally {
        isProcessing = false;
      }
    }
  }
}


//
// (async () => {
//   // Step 1: Get Current Song and Artist
//   trackInfo = await getSongTitleAndArtist();
//   if (!trackInfo) {
//     console.error('No track info available.');
//     return;
//   }
//
//   const [songTitle, artist] = trackInfo;
//   console.log(`Now playing: ${songTitle} by ${artist}`);
//   const songInfo = { songTitle, artist };
//   sessionStorage.setItem('currentSongInfo', JSON.stringify(songInfo));
//
//   try {
//     // Step 2: Get URL of lyrics from Genius
//     const songInfoUrl = await fetchSongInfoFromGenius(
//       songTitle,
//       artist,
//       targetLanguage
//     );
//     if (!songInfoUrl) {
//       console.warn('Failed to fetch song info URL.');
//       return;
//     }
//     console.log(`Fetched Song Info URL: ${songInfoUrl}`);
//
//     try {
//       extractedLyrics = await fetchLyricsFromUrl(songInfoUrl);
//     } catch (fetchError) {
//       console.error('Error fetching lyrics:', fetchError);
//       extractedLyrics = ['Lyrics not available.'];
//     }
//   } catch (geniusError) {
//     console.error('Error fetching song info from Genius:', geniusError);
//   }
//
//   // Create Lyrics Object
//   const translatedSongObject = {
//     meta: {
//       title: songTitle,
//       artist: artist,
//     },
//     lyrics: extractedLyrics,
//   };
//
//   // Store the object in the data store
//   setTranslatedSongObject(translatedSongObject);
//   console.log('Translated Song Object stored:', translatedSongObject);
//
//   // Show the Translated Lyrics
//   showLyricsTranslated();
// })();

(async () => {
  await watchTrackChanges(); // 先监听再获取歌词
})();

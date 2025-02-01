import {
  fetchAvailableLanguagesUrl,
  fetchLyricsFromUrl,
  fetchSongInfoFromGenius,
} from './modules/backgroundMessenger';
import { showLyricsTranslated } from './modules/translate';
import { getSongTitleAndArtist } from './modules/spotifyInfo';
import { setTranslatedSongObject, getTranslatedSongObject } from './dataStore';

console.log('Content script works!!!!');
console.log('Must reload extension for modifications to take effect.');

var targetLanguage = 'English';

let extractedLyrics = [];
let allLanguages = [];
let trackInfo = [];

(async () => {
  // Step 1: Get Current Song and Artist
  trackInfo = await getSongTitleAndArtist();
  if (!trackInfo) {
    console.error('No track info available.');
    return;
  }

  const [songTitle, artist] = trackInfo;
  console.log(`Now playing: ${songTitle} by ${artist}`);

  try {
    // Step 2: Get URL of lyrics from Genius
    const songInfoUrl = await fetchSongInfoFromGenius(
      songTitle,
      artist,
      targetLanguage
    );
    if (!songInfoUrl) {
      console.error('Failed to fetch song info URL.');
      return;
    }
    console.log(`Fetched Song Info URL: ${songInfoUrl}`);

    // Step 3: Translate Lyrics to Target Language
    extractedLyrics = await fetchLyricsFromUrl(songInfoUrl);

    // Step 4: Get all other available languages
    try {
      const availableLanguagesUrl = await fetchAvailableLanguagesUrl(
        songInfoUrl
      );
      console.log('Available languages:', availableLanguagesUrl);

      // try {
      //   allLanguages = availableLanguagesUrl.find(
      //     (languageObj) => languageObj.language === targetLanguage
      //   );
      //   try {
      //     if (allLanguages) {
      //       const lyricsUrl = allLanguages.href;
      //       extractedLyrics = await fetchLyricsFromUrl(lyricsUrl);
      //       console.log('Lyrics:', extractedLyrics);
      //     } else {
      //       console.log(
      //         `No lyrics available for the target language: ${targetLanguage}`
      //       );
      //     }
      //   } catch (error) {
      //     console.error(
      //       `No lyrics available for the target language: ${targetLanguage}`
      //     );
      //   }
      // } catch (error) {
      //   console.error('Failed to fetch lyrics:', error);
      // }
    } catch (error) {
      console.error('Failed to fetch available languages:', error);
    }
  } catch (error) {
    console.error('Failed to fetch or process song info:', error);
  }

  // Create Lyrics Object
  const translatedSongObject = {
    meta: {
      title: songTitle,
      artist: artist,
    },
    lyrics: extractedLyrics,
  };

  // Store the object in the data store
  setTranslatedSongObject(translatedSongObject);
  console.log('Translated Song Object stored:', translatedSongObject);

  // Show the Translated Lyrics
  showLyricsTranslated();
})();

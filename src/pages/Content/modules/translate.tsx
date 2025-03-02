import { translatedSongObject } from '../dataStore';
import { SpotifyPlayerApi, SpotifyTrack } from '../../../pages/Background/api/spotifyPlayerApi';

// Get All Lyrics
const getAllLyricsLines = (): HTMLDivElement[] | null => {
  const lyricElementSelector = '[data-testid="fullscreen-lyric"]';
  const lyricElements =
    document.querySelectorAll<HTMLDivElement>(lyricElementSelector);
  if (lyricElements.length === 0) {
    console.log('No lyrics found on the page.');
    return null;
  }
  return Array.from(lyricElements);
};

// Insert TranslatedLyrics to the spotify web page
const insertTranslatedLyrics = (): void => {
  const lyricsLines = getAllLyricsLines();
  let translationIndex = 0;

  lyricsLines?.forEach((line) => {
    if (line.querySelector('.translated-line')) return;
    if (line.textContent?.trim() === '') return;

    // Create translated lyrics element
    const translatedElement = document.createElement('div');
    translatedElement.textContent =
      translatedSongObject.lyrics[translationIndex] ||
      '[Translation not available]';
    translatedElement.className = 'translated-line';

    line.appendChild(translatedElement);

    translationIndex++;
  });
  console.log('Mock translations inserted successfully.');
};

// Monitor for lyrics loading
let debounceTimeout: ReturnType<typeof setTimeout> | null = null;
const observeLyrics = (): void => {
  const targetNode = document.body;
  const config = { childList: true, subtree: true };

  const observer = new MutationObserver(() => {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      const lyricsLines = getAllLyricsLines();
      if (lyricsLines && lyricsLines.length > 0) {
        insertTranslatedLyrics();
        observer.disconnect();
      } else {
        console.warn('Lyrics not found during DOM mutation.');
      }
    }, 300); // debounce time
  });
  observer.observe(targetNode, config);
  console.log('Started observing lyrics.');
};

const getTranslationsForTrack = async (track: SpotifyTrack): Promise<string[]> => {
  // 临时实现，返回空数组
  return [];
};

const updateLyricsTranslation = async (track: SpotifyTrack) => {
  // 清除现有的翻译
  const existingTranslations = document.querySelectorAll('.translated-line');
  existingTranslations.forEach(el => el.remove());

  // 获取新的翻译
  try {
    const translations = await getTranslationsForTrack(track);
    translatedSongObject.lyrics = translations;

    // 重新插入翻译
    insertTranslatedLyrics();
  } catch (error) {
    console.error('获取歌词翻译失败:', error);
  }
};

export const initializeLyricsTranslation = (spotifyApi: SpotifyPlayerApi): void => {
  console.log('初始化歌词翻译...');

  // 监听播放状态变化
  const cleanup = spotifyApi.watchPlaybackState((track) => {
    if (track) {
      console.log('歌曲变更:', track.name);
      updateLyricsTranslation(track);
    }
  });

  // 开始观察DOM变化
  observeLyrics();
};

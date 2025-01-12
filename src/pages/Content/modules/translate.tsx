// 引入 mock 数据
import { mockTranslatedLyrics } from './api/lyricsTranslatedApi';

// Get All Lyrics
const getAllLyrics = (): HTMLDivElement[] | null => {
  const lyricElementSelector = '[data-testid="fullscreen-lyric"]';
  const lyricElements =
    document.querySelectorAll<HTMLDivElement>(lyricElementSelector);
  if (lyricElements.length === 0) {
    console.log('No lyrics found on the page.');
    return null;
  }
  return Array.from(lyricElements);
};

// Insert TranslatedLyrics
const insertTranslatedLyrics = (): void => {
  const lyricsLines = getAllLyrics();
  lyricsLines?.forEach((line, index) => {
    if (line.querySelector('.translated-line')) return;

    // Create translated lyrics
    const translatedElement = document.createElement('div');
    translatedElement.textContent =
      mockTranslatedLyrics[index] || '[Translation not available]';
    translatedElement.className = 'translated-line';

    line.appendChild(translatedElement);
  });
  console.log('Mock translations inserted successfully.');
};

// Await all the lyri and translate
const translateLyricsOnce = (): void => {
  const maxAttempts = 10;
  let attempts = 0;
  const tryTranslate = () => {
    const lyricsLines = getAllLyrics();
    if (lyricsLines) {
      insertTranslatedLyrics();
    } else if (attempts < maxAttempts) {
      attempts++;
      console.log(`Lyrics not found, retrying... (${attempts}/${maxAttempts})`);
      setTimeout(tryTranslate, 500); // try every 500ms 这里类似于循环
    } else {
      console.log('Failed to find lyrics after maximum retries.');
    }
  };
  tryTranslate();
};

export const init = (): void => {
  console.log('Initializing lyrics translation...');
  translateLyricsOnce();
};

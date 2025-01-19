import { mockTranslatedLyrics } from '../../Background/api/lyricsTranslatedApi';

// Get Song Name and Author/Team Name
const getSongInfo = (): string[] => {
  return [mockTranslatedLyrics.meta.title, mockTranslatedLyrics.meta.artist];
};

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

// Insert TranslatedLyrics to the spotify web page
const insertTranslatedLyrics = (): void => {
  const lyricsLines = getAllLyrics();
  let translationIndex = 0;

  lyricsLines?.forEach((line) => {
    if (line.querySelector('.translated-line')) return;
    if (line.textContent?.trim() === '') return;

    // Create translated lyrics element
    const translatedElement = document.createElement('div');
    translatedElement.textContent =
      mockTranslatedLyrics.lyrics[translationIndex] ||
      '[Translation not available]';
    translatedElement.className = 'translated-line';

    line.appendChild(translatedElement);

    translationIndex++;
  });
  console.log('Mock translations inserted successfully.');
};

// Monitor for lyrics loading
let debounceTimeout: NodeJS.Timeout | null = null;
const observeLyrics = (): void => {
  const targetNode = document.body;
  const config = { childList: true, subtree: true };

  const observer = new MutationObserver(() => {
    if (debounceTimeout) clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
      const lyricsLines = getAllLyrics();
      if (lyricsLines && lyricsLines.length > 0) {
        insertTranslatedLyrics();
      } else {
        console.warn('Lyrics not found during DOM mutation.');
      }
    }, 300); // debounce time
  });
  observer.observe(targetNode, config);
  console.log('Started observing lyrics.');
};

export const showLyricsTranslated = (): void => {
  console.log('Initializing lyrics translation...');
  observeLyrics();
};

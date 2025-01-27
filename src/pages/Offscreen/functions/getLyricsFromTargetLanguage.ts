export function extractLyricsFromHTML(html: string): string[] {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const lyricElementSelector = '[data-lyrics-container="true"]';
  const lyricContainer = doc.querySelector(lyricElementSelector);

  if (!lyricContainer) {
    throw new Error('No lyrics container found');
  }

  const lyricLines = lyricContainer.innerHTML
    .split(/<br\s*\/?>/gi)
    .map((line) => line.replace(/<[^>]*>/g, '').trim())
    .filter((line) => line && !line.startsWith('['));

  if (lyricLines.length === 0) {
    throw new Error('No lyrics found');
  }

  return lyricLines;
}

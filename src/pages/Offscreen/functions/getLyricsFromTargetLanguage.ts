export function extractLyricsFromHTML(html: string): string[] {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  const lyricElementSelector = '[data-lyrics-container="true"]';
  const lyricContainers = doc.querySelectorAll<HTMLElement>(lyricElementSelector);

  if (lyricContainers.length === 0) {
    throw new Error('No lyrics containers found');
  }

  const lyricLines = Array.from(lyricContainers)
    .map((container) => container.innerHTML)
    .map((html) => html.split(/<br\s*\/?>/gi))
    .map((lines) => lines.map((line) => line.replace(/<[^>]*>/g, '').trim()))
    .map((lines) => lines.filter((line) => line && !line.startsWith('[')))
    .flat();

  if (lyricLines.length === 0) {
    throw new Error('No lyrics found');
  }

  return lyricLines;
}

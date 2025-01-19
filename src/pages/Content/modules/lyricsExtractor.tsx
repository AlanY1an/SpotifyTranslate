
export const extractLyricsFromURL = (url: string) => {
  // get lyrics container
  const lyricElementSelector = '[data-lyrics-container="true"]';
  const lyricContainer = document.querySelector(lyricElementSelector);

  if (!lyricContainer) {
    console.log('No lyrics container found on the page.');
    return null;
  }

  // extract lyrics: remove elements and separate lyrics by line
  const lyricsList : string[] = [];
  const lyricLines = lyricContainer.innerHTML.split('<br>'); // split lines by <br>

  lyricLines.forEach(line => {
    // remove HTML tags
    const cleanText = line.replace(/<[^>]*>/g, '').trim();

    // skip the line start with '['
    if (cleanText.startsWith('[')) {
      return
    }

    if (cleanText) {
      lyricsList.push(cleanText);
    }
  });

  // testing message
  console.log("lyricsExtractor: lyricsList " + lyricsList)

  // send lyrics data to background.js
  chrome.runtime.sendMessage({ action: 'lyricsExtract', lyrics: lyricsList });
};

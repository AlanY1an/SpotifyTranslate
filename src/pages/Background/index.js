console.log('This is the background page.');
console.log('Put the background scripts here.');


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'lyricsExtract') {
    console.log('Received lyrics from content script:', message.lyrics);

    // process the lyrics data here


    // send response
    sendResponse({ success: true });
  }
});
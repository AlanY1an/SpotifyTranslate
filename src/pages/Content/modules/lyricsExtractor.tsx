// Send message to offscreen document to extract lyrics
// This function is called from the content script
// It sends a message to the offscreen document with the url of the lyrics page
// The offscreen document extracts the lyrics and sends a response back to the content script 

export const sendExtractLyricsMessages = (testLyricsURL: string): void => {
  chrome.runtime.sendMessage(
    { type: 'EXTRACT_LYRICS', url: testLyricsURL },
    (response) => {
      if (response.success) {
        console.log('Extracted lyrics:', response.lyrics);
      } else {
        console.log('Failed to extract lyrics: ', response.error);
      }
    }
  );
}


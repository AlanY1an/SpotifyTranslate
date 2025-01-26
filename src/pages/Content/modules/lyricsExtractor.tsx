
export const sendExtractLyricsMessages = (): void => {
  const testLyricsURL = "https://genius.com/Genius-brasil-traducoes-ed-sheeran-shape-of-you-traducao-em-portugues-lyrics"
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


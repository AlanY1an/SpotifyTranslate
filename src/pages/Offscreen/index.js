//https://www.youtube.com/watch?v=RUVgd98DXxM


async function parseLyrics(url) {
  try {
    // Fetch the webpage
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();

    // Parse HTML in Offscreen
    const doc = new DOMParser().parseFromString(html, "text/html")

    // Extract lyrics
    const lyricElementSelector = '[data-lyrics-container="true"]';
    const lyricContainer = doc.querySelector(lyricElementSelector);

    if (!lyricContainer) {
      console.warn("No lyrics container found.");
      return [];
    }

    const lyricLines = lyricContainer.innerHTML.split(/<br\s*\/?>/gi, '\n')
      .map(line => line.replace(/<[^>]*>/g, "").trim()) // Remove HTML tags
      .filter(line => line && !line.startsWith("["));; // Remove lines starting with [

    if (lyricLines.length === 0) {
      console.warn("No lyrics found.");
      return []; // If no lyrics found, return empty array
    }

    return lyricLines

  } catch (error) {
    console.error("Error parsing lyrics:", error);
    throw error;
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("offscreen's index.js")
  if (message.type === "EXTRACT_LYRICS") {
    parseLyrics(message.url).then(lyrics => {
      sendResponse({ lyrics });
    });
  }
  return true;
});
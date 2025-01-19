//https://www.youtube.com/watch?v=RUVgd98DXxM


async function parseLyrics(url) {
  try {
    // Fetch the webpage
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch: ${response.status}`);
    }

    const html = await response.text();

    console.log(html)

    // Parse HTML in Offscreen
    // const doc = new DOMParser().parseFromString(html, "text/html")
    //
    // // Extract lyrics
    // const lyricElementSelector = '[data-lyrics-container="true"]';
    // const lyricContainer = doc.querySelector(lyricElementSelector);
    //
    // if (!lyricContainer) {
    //   console.warn("No lyrics container found.");
    //   return [];
    // }

    // const lyricLines = lyricContainer.innerHTML.split("<br>");
    // return lyricLines
    //   .map(line => line.replace(/<[^>]*>/g, "").trim())
    //   .filter(line => line && !line.startsWith("["));
    return []
  } catch (error) {
    console.error("Error parsing lyrics:", error);
    return [];
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("offscreen's index.js")
  if (message.type === "EXTRACT_LYRICS") {
    parseLyrics(message.url).then(lyrics => {
      sendResponse({ lyrics });
    });
  }
});
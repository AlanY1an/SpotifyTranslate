//https://www.youtube.com/watch?v=RUVgd98DXxM

// 添加消息监听器
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "PARSE_LYRICS") {
    try {
      // 解析HTML
      const doc = new DOMParser().parseFromString(message.html, "text/html");

      // 提取歌词
      const lyricElementSelector = '[data-lyrics-container="true"]';
      const lyricContainer = doc.querySelector(lyricElementSelector);

      if (!lyricContainer) {
        sendResponse({ success: false, error: "No lyrics container found" });
        return true;
      }

      const lyricLines = lyricContainer.innerHTML.split(/<br\s*\/?>/gi)
        .map(line => line.replace(/<[^>]*>/g, "").trim())
        .filter(line => line && !line.startsWith("["));

      if (lyricLines.length === 0) {
        sendResponse({ success: false, error: "No lyrics found" });
        return true;
      }

      sendResponse({ success: true, lyrics: lyricLines });
    } catch (error) {
      sendResponse({ success: false, error: error.message });
    }
    return true;
  }
});

// 保留原有的 parseLyrics 函数，但现在通过消息系统调用它
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

    console.log(lyricContainer) // log the lyric container

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
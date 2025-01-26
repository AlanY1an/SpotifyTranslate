console.log('Offscreen script loaded');

// 监听来自 popup 的消息
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  console.log('Offscreen received message:', message);

  if (message.target === 'offscreen' && message.type === 'FETCH_LYRICS') {
    try {
      console.log('Fetching URL:', message.url);
      const response = await fetch(message.url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const html = await response.text();
      console.log('Fetched HTML length:', html.length);

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // 专门查找语言选择器中的链接
      const languageLinks = Array.from(
        doc.querySelectorAll('.LyricsHeader-sc-2146e4fc-11')
      )
        .map((link) => ({
          language: link.querySelector('div')?.textContent || 'Unknown',
          href: link.href,
        }))
        .filter((item) => item.language && item.href);

      console.log('Found language links:', languageLinks);
      // 返回格式类似: [{ language: 'Español', href: 'https://genius.com/...' }, ...]

      chrome.runtime.sendMessage({
        type: 'LYRICS_RESULT',
        links: languageLinks,
      });
    } catch (error) {
      console.error('Error in offscreen script:', error);
      chrome.runtime.sendMessage({
        type: 'LYRICS_RESULT',
        error: error.message,
      });
    }
  }
});

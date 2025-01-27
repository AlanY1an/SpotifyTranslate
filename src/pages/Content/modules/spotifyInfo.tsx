// 等待元素加载的通用方法
function waitForElement(selector, timeout = 5000) {
  return new Promise((resolve) => {
    // 先检查元素是否已存在
    const existingElement = document.querySelector(selector);
    if (existingElement) {
      resolve(existingElement);
      return;
    }

    const observer = new MutationObserver((mutations, obs) => {
      const element = document.querySelector(selector);
      if (element) {
        obs.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    setTimeout(() => {
      observer.disconnect();
      resolve(null);
    }, timeout);
  });
}

// 获取歌曲标题和艺术家信息
export async function getSongTitleAndArtist() {
  console.log('Getting current track info...');

  // 定义查询选择器用于获取歌曲标题和艺术家信息
  const songTitleQuery = `
    a[data-testid="nowplaying-track-link"], 
    .Root footer .ellipsis-one-line a[href*="/track/"], 
    .Root footer .ellipsis-one-line a[href*="/album/"], 
    .Root footer .standalone-ellipsis-one-line a[href*="/album/"], 
    [data-testid="context-item-info-title"] a[href*="/album/"], 
    [data-testid="context-item-info-title"] a[href*="/track/"]
  `;
  const songArtistsQuery = `
    .Root footer .ellipsis-one-line a[href*="/artist/"], 
    .Root footer .standalone-ellipsis-one-line a[href*="/artist/"], 
    a[data-testid="context-item-info-artist"][href*="/artist/"], 
    [data-testid="context-item-info-artist"] a[href*="/artist/"]
  `;

  try {
    // 等待歌曲标题元素加载
    const titleElement = await waitForElement(songTitleQuery);
    // 等待艺术家信息元素加载
    const artistElements = document.querySelectorAll(songArtistsQuery);

    if (!titleElement || artistElements.length === 0) {
      console.log('Failed to find song info within timeout.');
      return null;
    }

    // 提取并清理歌曲标题
    const songTitle = titleElement.textContent?.trim() || '';
    // 提取并清理艺术家信息
    const songArtists = Array.from(artistElements)
      .map((el) => el.textContent.trim())
      .filter((artist, index, self) => self.indexOf(artist) === index);

    console.log('Found song:', songTitle, 'by', songArtists);
    return [songTitle, songArtists.join(', ')];
  } catch (error) {
    console.error('Error getting track info:', error);
    return null;
  }
}

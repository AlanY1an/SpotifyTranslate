function waitForElement(
  selector: string,
  timeout = 5000
): Promise<HTMLElement | null> {
  return new Promise((resolve) => {
    const observer = new MutationObserver((mutations, obs) => {
      const element = document.querySelector(selector);
      if (element) {
        obs.disconnect(); // 找到目标元素后停止监听
        resolve(element as HTMLElement);
      }
    });

    // 开始观察文档的变化
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // 超时处理
    setTimeout(() => {
      observer.disconnect();
      resolve(null); // 超时后返回 null
    }, timeout);
  });
}

// 示例：等待当前播放歌曲的标题元素加载
export async function waitForSongTitle() {
  const element = await waitForElement('[data-testid="nowplaying-track-link"]');
  if (element) {
    console.log('Found song title:', element.textContent);
  } else {
    console.log('Failed to find song title within timeout.');
  }
  console.log(element);
  return element;
}

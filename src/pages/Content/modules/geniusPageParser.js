// 创建一个新的解析器模块
export function parseLyricsPage() {
  const lyricsContainer = document.querySelector('.lyrics');
  const lyrics = lyricsContainer ? lyricsContainer.textContent : null;
  return lyrics;
} 
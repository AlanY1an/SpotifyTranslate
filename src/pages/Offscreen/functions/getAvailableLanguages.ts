// 函数：解析 HTML 并提取 <a> 的 href 和 <div> 的内容
export function extractHrefAndDivContent(
  html: string
): { href: string; language: string }[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // 查询 <a> 元素
  const links = Array.from(
    doc.querySelectorAll(
      'a.TextButton-sc-5aad70cc-0.LyricsHeader-sc-2146e4fc-11'
    )
  );

  // 提取 <a> 的 href 和内部 <div> 的内容
  return links.map((link) => {
    const href = (link as HTMLAnchorElement).href; // 获取 href 属性
    const language =
      link.querySelector('div')?.textContent?.trim() || 'Unknown'; // 获取 <div> 的文本
    return { language, href };
  });
}

// 处理语言链接解析
export async function parseAvailableLanguages(url: string, sendResponse: any) {
  try {
    console.log('Fetching URL:', url);

    // Fetch the HTML content from the URL
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const html = await response.text();
    console.log('Fetched HTML length:', html.length);

    // Parse the HTML and extract data
    const languageLinks = extractHrefAndDivContent(html);

    console.log('Extracted language links:', languageLinks);

    // Send the extracted data directly to the caller
    sendResponse({ links: languageLinks });
  } catch (error) {
    console.error('Error in Offscreen:', error);
    // Send an error message directly to the caller
    sendResponse({ error: (error as Error).message });
  }
}

// offscreenManager.ts
import { ensureOffscreenExists, cleanupOffscreen } from './offscreenTools';

// Handle Fetch Available Languages URL
export async function handleFetchAvaLanguageUrl(
  message: any,
  sendResponse: (response: any) => void
): Promise<void> {
  if (!message.url) {
    sendResponse({
      error: 'Song info URL is required to fetch available languages.',
    });
    return;
  }

  console.log('songInfoUrl:', message.url);
  console.log('Ensuring Offscreen document exists...');
  await ensureOffscreenExists();

  try {
    console.log('Sending parse languages request to Offscreen...');
    chrome.runtime.sendMessage(
      {
        target: 'offscreen',
        type: message.type,
        url: message.url, // Extracted from the message payload
      },
      (response) => {
        if (response && response.error) {
          console.error('Error from Offscreen:', response.error);
          sendResponse({ error: response.error });
        } else {
          console.log('Received available languages:', response?.links);
          sendResponse({ links: response?.links || [] });
        }
      }
    );
  } catch (error) {
    console.error('Error in handleFetchAvaLanguageUrl:', error);
    sendResponse({ error: (error as Error).message });
  }
}

export async function handleExtractLyricsFromURL(
  message: { url: string; type: string },
  sendResponse: (response: any) => void
): Promise<boolean> {
  if (!message.url) {
    sendResponse({
      error: 'Lyrics URL is required to extract lyrics.',
    });
    return false;
  }

  console.log('Lyrics URL:', message.url);
  console.log('Ensuring Offscreen document exists...');
  await ensureOffscreenExists();

  try {
    console.log('Fetching lyrics page content...');
    const response = await fetch(message.url);
    const html = await response.text();

    console.log('Sending extract lyrics request to Offscreen...');
    chrome.runtime.sendMessage(
      {
        target: 'offscreen',
        type: 'EXTRACT_LYRICS',
        html: html,
      },
      (response) => {
        if (response.error) {
          console.error('Error from Offscreen:', response.error);
          sendResponse({ error: response.error });
        } else {
          console.log('Received extracted lyrics:', response);
          sendResponse(response);
        }
      }
    );
  } catch (error) {
    console.error('Error in handleExtractLyricsFromURL:', error);
    sendResponse({ error: (error as Error).message });
  }

  // Keep the message channel open
  return true;
}

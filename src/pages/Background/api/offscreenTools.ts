// Ensure Offscreen Document Exists
export async function ensureOffscreenExists(): Promise<void> {
  // @ts-expect-error chrome.offscreen exists but TypeScript doesn't know about it
  const offscreenExists = await chrome.offscreen.hasDocument();
  console.log('Offscreen document exists:', offscreenExists);
  if (!offscreenExists) {
    // @ts-expect-error chrome.offscreen exists but TypeScript doesn't know about it
    await chrome.offscreen.createDocument({
      url: chrome.runtime.getURL('offscreen.html'),
      reasons: ['DOM_PARSER'],
      justification: 'Parse Genius lyrics page for available languages',
    });
    console.log('Offscreen document created');
  }
}

// Cleanup Offscreen Document
export async function cleanupOffscreen(): Promise<void> {
  try {
    // @ts-expect-error chrome.offscreen exists but TypeScript doesn't know about it
    const offscreenExists = await chrome.offscreen.hasDocument();
    if (offscreenExists) {
      console.log('Closing existing Offscreen document...');
      // @ts-expect-error chrome.offscreen exists but TypeScript doesn't know about it
      await chrome.offscreen.closeDocument();
    }
  } catch (error) {
    console.error('Error closing Offscreen document:', error);
  }
}


export async function ensureOffscreenDocument() {
  const offscreenUrl = chrome.runtime.getURL("offscreen.html");

  const existingOffscreen = await chrome.offscreen.hasDocument();
  if (!existingOffscreen) {
    await chrome.offscreen.createDocument({
      url: offscreenUrl,
      reasons: ["DOM_PARSER"],
      justification: "Required to parse content from HTML."
    });
  }
}



// This function is called from the content script and ensures that an offscreen document exists before sending a message to it.
// It returns true to keep the message channel open.

export async function ensureOffscreenDocument(message, sendResponse) {
  const offscreenUrl = chrome.runtime.getURL("offscreen.html");

  const existingOffscreen = await chrome.offscreen.hasDocument();  // check if offscreen document exists
  if (!existingOffscreen) {
    await chrome.offscreen.createDocument({   // create offscreen document
      url: offscreenUrl, // offscreen document url
      reasons: ["DOM_PARSER"], // offscreen document reasons
      justification: "Required to parse content from HTML." // offscreen document justification
    });
  }
  chrome.runtime.sendMessage(
    { type: "EXTRACT_LYRICS", url: message.url }, // send message to offscreen document with url  
    response => {
      sendResponse(response); // send response to background page
    }
  );
  return true; // keep the message channel open
}
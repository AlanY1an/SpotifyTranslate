// This function is called from the content script and ensures that an offscreen document exists before sending a message to it.
// It returns true to keep the message channel open.

export function extractLyricsFromURL(message, sendResponse) {
  const offscreenUrl = chrome.runtime.getURL("offscreen.html");

  return chrome.offscreen.hasDocument()
    .then(existingOffscreen => {
      if (!existingOffscreen) {
        return chrome.offscreen.createDocument({
          url: offscreenUrl,
          reasons: ["DOM_PARSER"],
          justification: "Required to parse content from HTML."
        });
      }
    })
    .then(() => {
      // get the html content of the lyrics page
      return fetch(message.url)
        .then(response => response.text())
        .then(html => {
          // send the html to the offscreen document
          return chrome.runtime.sendMessage({
            type: "PARSE_LYRICS",
            html: html
          });
        });
    })
    .then(response => {
      // send the response and close the offscreen document
      return chrome.offscreen.closeDocument()
        .then(() => {
          sendResponse(response);
        });
    })
    .catch(error => {
      console.error('Error in offscreen document:', error);
      // even if there is an error, close the offscreen document
      return chrome.offscreen.closeDocument()
        .finally(() => {
          sendResponse({ success: false, error: error.message });
        });
    });
}
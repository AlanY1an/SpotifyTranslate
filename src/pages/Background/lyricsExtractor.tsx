import { ensureOffscreenDocument } from "./offscreenHelper";

export function handleExtractLyricsMessages() {
  chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    if (message.type === "EXTRACT_LYRICS") {
      await ensureOffscreenDocument();

      chrome.runtime.sendMessage(
        { type: "EXTRACT_LYRICS", url: message.url },
        response => {
          sendResponse(response);
        }
      );
      return true; // Keep the message channel open
    }
  });
}

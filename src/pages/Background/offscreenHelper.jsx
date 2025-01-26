// This function is called from the content script and ensures that an offscreen document exists before sending a message to it.
// It returns true to keep the message channel open.

/**
 * create or get the offscreen document
 * @param {string} url - the URL of the offscreen document
 * @returns {Promise<void>} - the Promise to create/get the document
 * @description check if the offscreen document exists, if not, create a new one
 */
function getOffscreenDocument(url) {
  return chrome.offscreen.hasDocument()
    .then(existingOffscreen => {
      if (!existingOffscreen) {
        return chrome.offscreen.createDocument({
          url: url,
          reasons: ["DOM_PARSER"],
          justification: "Required to parse content from HTML."
        });
      }
    });
}

/**
 * safely close the offscreen document
 * @returns {Promise<void>} - the Promise to close the document
 * @description try to close the offscreen document, and handle the possible error
 */
function closeOffscreenDocument() {
  return chrome.offscreen.closeDocument()
    .catch(error => {
      console.error('Error closing offscreen document:', error);
    });
}

/**
 * high-order function: wrap the Promise operation, ensure the correct management of the offscreen document lifecycle
 * @param {Function} operation - the operation to be executed in the offscreen document
 * @returns {Promise<any>} - the Promise of the operation result
 * @description 
 * 1. create the offscreen document
 * 2. execute the specified operation
 * 3. close the document and return the result
 * 4. ensure the document is closed correctly even if an error occurs
 */
function withOffscreenDocument(operation) {
  const offscreenUrl = chrome.runtime.getURL("offscreen.html");

  return getOffscreenDocument(offscreenUrl)
    .then(() => operation())
    .then(result => {
      // operation success: close the document and return the result
      return closeOffscreenDocument()
        .then(() => result);
    })
    .catch(error => {
      // operation failed: close the document and throw the error
      return closeOffscreenDocument()
        .then(() => {
          throw error;
        });
    });
}

/**
 * the main function to handle the lyrics extraction request
 * @param {Object} message - the message object containing the request information
 * @param {Function} sendResponse - the callback function to send the response
 * @returns {boolean} - return true to keep the message channel open
 * @description 
 * the processing flow:
 * 1. create the offscreen document
 * 2. get the lyrics page content
 * 3. send the content to the offscreen document for parsing
 * 4. handle the response or error
 * 5. close the offscreen document
 */
export function ensureOffscreenDocument(message, sendResponse) {
  // use withOffscreenDocument to wrap the entire operation process
  withOffscreenDocument(() =>
    // get the lyrics page content
    fetch(message.url)
      .then(response => response.text())
      // send the content to the offscreen document for parsing
      .then(html =>
        chrome.runtime.sendMessage({
          type: "PARSE_LYRICS",
          html: html
        })
      )
  )
    .then(response => {
      // success: send the parsed result
      sendResponse(response);
    })
    .catch(error => {
      // failed: record the error and send the error response
      console.error('Error in offscreen document:', error);
      sendResponse({
        success: false,
        error: error.message
      });
    });

  // keep the message channel open
  return true;
}
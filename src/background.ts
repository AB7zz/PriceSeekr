export {}

chrome.runtime.onInstalled.addListener(() => {
    console.log('its installed')
})

const filter = {
    url: [
      {
        urlMatches: 'amazon',
      }
    ],
};

  
chrome.webNavigation.onCompleted.addListener(async(details) => {
    console.info("The user has loaded my favorite website!");
    if(details.frameType == "outermost_frame"){
        console.log(details)
        const tabId = details.tabId
        chrome.tabs.sendMessage(tabId, {message: "Message from background script"}, function (response) {
            if (chrome.runtime.lastError) {
                console.error(chrome.runtime.lastError);
            } else {
                console.log('Message sent to content script:');
            }
        });
    }
}, filter);
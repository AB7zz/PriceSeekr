export {}
import type { PlasmoMessaging } from "@plasmohq/messaging"


const handler: PlasmoMessaging.MessageHandler = async (req, res) => {
    const message = "Hello!"
   
    res.send({
      message
    })
}


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
    if(details.frameType == "outermost_frame"){
        console.info("The user has loaded my favorite website!");
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
import type { PlasmoMessaging } from "@plasmohq/messaging"
import selectors from '../../json/ecommerce_scrape.json'
 
const handler: PlasmoMessaging.PortHandler = async (req, res) => {
  chrome.webNavigation.onCompleted.addListener(async(details) => {
      if(details.frameType == "outermost_frame"){
          console.log(details)
          const [result] = await chrome.scripting.executeScript({
            target: { tabId: details.tabId },
            func: (url) => {
                let domain = '';
                if (url.includes('amazon')) {
                    domain = 'amazon';
                } 
                else if (url.includes('ebay')){
                    domain = 'ebay';
                }
                else if (url.includes('walmart')){
                    domain = 'walmart';
                }
                else if (url.includes('bestbuy')){
                    domain = 'bestbuy';
                }

                const { title: titleSelector, price: priceSelector, image: imageSelector } = selectors[domain] || {};

                console.log(titleSelector, priceSelector, imageSelector, domain)

                const productTitle = document.querySelector(titleSelector)?.innerHTML || "";

                const price = document.querySelector(priceSelector)?.innerHTML || "";
                
                const image = document.querySelector(imageSelector)?.getAttribute('src') || "";
                
                return [
                    productTitle.replace(/ {2,}/g, ''),
                    image,
                    price,
                ]
            },
            args: [details.url]
        });
        const data = result.result;
        if(data && data[0] != "" && data[1] != "" && data[2] != "") {
            res.send({
              data: data
            })
        }
      }
  });
}
 
export default handler
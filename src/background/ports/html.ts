import type { PlasmoMessaging } from "@plasmohq/messaging"
 
const handler: PlasmoMessaging.PortHandler = async (req, res) => {
  // const filter = {
  //   url: [
  //     {
  //       urlMatches: 'amazon',
  //     }
  //   ],
  // };

  chrome.webNavigation.onCompleted.addListener(async(details) => {
      if(details.frameType == "outermost_frame"){
          console.log(details)
          const [result] = await chrome.scripting.executeScript({
            target: { tabId: details.tabId },
            func: (url) => {
                let productTitle, image, price
                if (url.includes('ebay')) {
                    productTitle = document.querySelector(".x-item-title__mainTitle .ux-textspans")?.innerHTML || "";
                    image = document.querySelector('img.a-dynamic-image')?.getAttribute('src') || document.querySelector('img.ux-image-magnify__image--original')?.getAttribute('src') || "";
                    price = document.querySelector('.x-price-primary .ux-textspans')?.innerHTML || "";
                    return [productTitle, image, price]
                } else if (url.includes('amazon')) {
                    productTitle = document.querySelector('#productTitle')?.innerHTML || "";
                    image = document.querySelector('#landingImage')?.getAttribute('src') || document.querySelector("img.a-dynamic-image")?.getAttribute('src') || "";
                    price = document.querySelector('.a-offscreen')?.innerHTML || "";
                    return [productTitle.replace(/ {2,}/g, ''), image, price]
                } else if (url.includes('walmart')){
                    productTitle = document.querySelector("#main-title")?.innerHTML || "";
                    image = document.querySelector('[data-testid="hero-image-container"] img')?.getAttribute("src") || ""
                    price = document.querySelector('[itemprop="price"]')?.innerHTML
                    return [productTitle, image, price]
                } else if (url.includes('bestbuy')){
                    productTitle = document.querySelector(".shop-product-title h1")?.innerHTML || ""
                    image = document.querySelector(".primary-image")?.getAttribute("src") || ""
                    price = document.querySelector('[data-testid="customer-price"] span')?.innerHTML || ""
                    return [productTitle, image, price]
                }
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
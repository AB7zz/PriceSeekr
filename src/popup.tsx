import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"
import Table from "~features/table"
import "~base.css"
import "~style.css"
import Similiar from "~features/similiar"
 
export const config: PlasmoCSConfig = {
  matches: [
    "http://www.amazon.com/*",
    "https://www.amazon.com/*",
    "http://smile.amazon.com/*",
    "https://smile.amazon.com/*",
    "https://www.amazon.ca/*",
    "https://www.amazon.co.uk/*",
    "http://www.amazon.it/*",
    "https://www.amazon.it/*",
    "https://www.amazon.fr/*",
    "https://www.amazon.es/*",
    "https://www.amazon.in/*"
  ],
  all_frames: true
}



function IndexPopup() {
  const [data, setData] = useState(null)
    const [page, setPage] = useState('/')
  useEffect(() => {
    console.log('use effect is run')
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      const getHTMLData = async(tab) => {
        try {
            if (tab) {
              const [result] = await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                func: () => {
                    const productTitle = document.querySelector('#productTitle').innerHTML
                    const price = `${document.querySelector('.a-price-symbol').innerHTML} ${document.querySelector('.a-price-whole').innerHTML}`
                    const image = document.querySelector('#landingImage').getAttribute('src')
                    const feature = document.querySelector('#feature-bullets').innerHTML
                    const details = document.querySelector('#detailBullets_feature_div').innerHTML
                    return [productTitle, price, image, feature, details]
                }
              });
              const data = result.result;
              console.log(result)
              chrome.storage.local.set({ 'data': data })
              setData(data)
            }
        } catch (error) {
            console.log(error)
        }
      }
      if (currentTab) {
        console.log('Popup clicked - Tab', currentTab);
        getHTMLData(currentTab);
      }
    });
  }, [])
  const renderContent = () => {
    if(page == '/'){
        return <Table data={data} />
    }else if(page == '/similiar'){
        return <Similiar />
    }
  }
  return (
    <>
      {renderContent()}
      <div className="flex py-5">
        <button onClick={() => setPage('/similiar')} className='m-auto bg-sky-500 text-white px-5 py-2 rounded'>View similiar products</button>
      </div>
    </>
  )
}

export default IndexPopup
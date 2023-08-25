import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"
import "~base.css"
import "~style.css"
import Similiar from "~features/similiar"
import Same from "~features/same"
import Navbar from "~components/Navbar"
import { MySearchProvider } from "~context/SearchContext"
 
// export const config: PlasmoCSConfig = {
//   matches: [
//     "http://www.amazon.com/*",
//     "https://www.amazon.com/*",
//     "http://smile.amazon.com/*",
//     "https://smile.amazon.com/*",
//     "https://www.amazon.ca/*",
//     "https://www.amazon.co.uk/*",
//     "http://www.amazon.it/*",
//     "https://www.amazon.it/*",
//     "https://www.amazon.fr/*",
//     "https://www.amazon.es/*",
//     "https://www.amazon.pl/*",
//     "https://www.amazon.in/*"
//   ],
//   all_frames: true
// }



function IndexPopup() {
  const [page, setPage] = useState('/similiar')
  const [pageData, setPageData] = useState(null)
  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      const getHTMLData = async(tab: any) => {
        console.log('getHTMLData is called')
        try {
            if (tab) {
                const [result] = await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: () => {
                        const productTitle = document.querySelector('#productTitle').innerHTML
                        console.log(productTitle)
                        
                        const image = document.querySelector('#landingImage') != null ? document.querySelector('#landingImage').getAttribute('src') : document.querySelector("img.a-dynamic-image").getAttribute('src')
                        console.log(image)
                        const price = document.querySelector('.a-offscreen').innerHTML
                        console.log(price)
                        // const price = `${document.querySelector('.a-price-symbol').innerHTML} ${document.querySelector('.a-price-whole').innerHTML}`
                        // const feature = document.querySelector('#feature-bullets').innerHTML
                        // console.log(feature)
                        // const details = document.querySelector('#detailBullets_feature_div').innerHTML
                        // console.log(details)
                        return [productTitle.replace(/ {2,}/g, ''), image, price]
                    }
                });
                const data = result.result;
                console.log("your data: ",data)
                chrome.storage.local.set({ 'data': data })
                setPageData(data)
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
      if(page == '/similiar'){
          return <Similiar data={pageData} />
      }else if(page == '/same'){
        return <Same data={pageData} />
    }
  }
  return (
    <>
      <MySearchProvider>
        <Navbar setPage={setPage} page={page} />
        {renderContent()}
        {page == "/" ? 
          <div className="flex py-5">
            <button onClick={() => setPage('/similiar')} className='m-auto bg-sky-500 text-white px-5 py-2 rounded'>View similiar products</button>
            <button onClick={() => setPage('/same')} className='m-auto bg-sky-500 text-white px-5 py-2 rounded'>View Same products</button>
          </div>
        // : page == "/similiar" ?
        //   <div className="flex py-5">
        //     <button onClick={() => setPage('/')} className='m-auto bg-sky-500 text-white px-5 py-2 rounded'>Go back</button>
        //   </div>
        // : page == "/same" ?
        //   <div className="flex py-5">
        //     <button onClick={() => setPage('/')} className='m-auto bg-sky-500 text-white px-5 py-2 rounded'>Go back</button>
        //   </div>
        // :
        //   <div className="flex py-5">
        //     <button onClick={() => setPage('/')} className='m-auto bg-sky-500 text-white px-5 py-2 rounded'>Home</button>
        //   </div>
        :
        <></>
        
        }
      </MySearchProvider>
    </>
  )
}

export default IndexPopup
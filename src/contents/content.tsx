import { usePort } from "@plasmohq/messaging/hook"
import type { PlasmoCSConfig } from "plasmo"
import React from 'react'
import { useSearchContext } from "~context/SearchContext"
 
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
 
function Content() {
  const htmlPort = usePort("html")
  // const [pageData, setPageData] = React.useState(null)
  // const {getHTMLData, setPageData, pageData} = useSearchContext()
 React.useEffect(() => {
  htmlPort.send({
    message: "run_get_html_data"
  })
 }, [])

 React.useEffect(() => {
  if (htmlPort.data?.data) {
    console.log(htmlPort.data?.data)
  } 
 }, [htmlPort.data?.data])

  return (
    <div>
      {htmlPort.data?.data &&
        htmlPort.data?.data.map(data => 
          <>
            <h1>{data}</h1>
          </>
        )
      }
    </div>
  )
}
 
export default Content
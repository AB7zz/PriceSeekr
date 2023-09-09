import { usePort } from "@plasmohq/messaging/hook"
import type { PlasmoCSConfig } from "plasmo"
import React from 'react'
import logo from 'data-base64:~assets/icon.development.png'
// import cssText from "data-text:./style.css"

// export const getStyle = () => {
//   const style = document.createElement("style")
//   style.textContent = cssText
//   return style
// }

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
      <div
      style={{
        width: "100%"
      }}
      >
        <div
        style={{
          backgroundColor: "#F2F2F2",
          paddingTop: "0.5rem",
          paddingBottom: "0.5rem",
          paddingLeft: "1.25rem",
          paddingRight: "1.25rem",
          position: "fixed",
          left: 0,
          top: "175px",
          width: "305px",
          borderTopRightRadius: "15px",
          borderBottomRightRadius: "15px",
        }}
        >
          <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
          >
            <img style={{height: "35px", marginRight: "30px"}} src={logo} alt="logo"  />
            <h3
            style={{
              color: "black",
              fontFamily: "'Poppins', sans-serif",
              fontWeight: "bold",
              fontSize: "1rem"
            }}
            >Search for the same product for cheaper prices!</h3>
          </div>
        </div>  
      </div>
      }
    </div>
  )
}
 
export default Content
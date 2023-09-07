// import { usePort } from "@plasmohq/messaging/hook"
// import type { PlasmoCSConfig } from "plasmo"
 
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
//     "https://www.amazon.in/*"
//   ],
//   all_frames: true
// }
 
// function DeltaTab() {
//   const mailPort = usePort("mail")
 
//   return (
//     <div>
//       {mailPort.data?.message}
//       <button
//         onClick={async () => {
//           mailPort.send({
//             hello: "world"
//           })
//         }}>
//         Send Data
//       </button>
//     </div>
//   )
// }
 
// export default DeltaTab
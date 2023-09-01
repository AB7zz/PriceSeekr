import React, { useEffect, useState } from "react"
import "~base.css"
import "~style.css"
import Similiar from "~features/similiar"
import Same from "~features/same"
import Navbar from "~components/Navbar"
import TopBar from "~components/TopBar"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useSearchContext } from "~context/SearchContext"
import { useSignOut, useGoogleLogin, useDetectChange } from "~firebase/hooks"
import BotNav from "~components/BotNav"

function Main() {
  const {user, getHTMLData, pageData, page, setPage} = useSearchContext()
  React.useEffect(() => {
    setPage('/similiar')
  }, [])
  const handleSignOut = useSignOut()
  const handleGoogleLogin = useGoogleLogin()
  const handleDetectChange = useDetectChange()

  useEffect(() => {
    handleDetectChange()
  }, [])

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
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
  };
  return (
    <>
       
        {user ? (
          <div>
            <TopBar />
            {/* <div className='bg-yellow-500 px-5 py-2 flex justify-between m-auto'>
              <div className="flex">
                <AccountCircleIcon className="text-white text-lg" /> 
                <p className="ml-3 text-lg text-white font-bold">{user.displayName} !</p>
              </div>
              <div>
                <button className="bg-white px-3 py-1 rounded-[10px] text-yellow-500 font-semibold text-center" onClick={handleSignOut}>Sign Out</button>
              </div>
            </div> */}
            {/* <Navbar page={page} setPage={setPage} />     */}
            <Navbar />    
            {renderContent()}
            <BotNav />
          </div>
        ) : (
          <div className="px-2 py-5 w-[360px] flex justify-center">
            <button className="bg-yellow-500 hover:bg-yellow-600 px-2 py-2 rounded-[15px] text-white" onClick={handleGoogleLogin}>Sign In with Google</button>
          </div>
        )}
    </>
  );
}

export default Main
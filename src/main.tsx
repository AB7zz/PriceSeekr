import React, { useEffect, useState } from "react";
import "~base.css";
import "~style.css";
import Similiar from "~features/similiar";
import Same from "~features/same";
import Preferences from '~components/preferences';
// import Signout from '~components/Signout'
import Login from '~components/Login'
import DisplayHistory from "~components/history";
import Signup from '~components/Signup'
import TopBar from "~components/TopBar";
import { useSearchContext } from "~context/SearchContext";
import Profile from "~components/profile";
import Choose from "~components/Choose";
import ContactUs from "~components/Contact";
import {
  useDetectChange,
  useReadDB,
} from "~firebase/hooks";
import BotNav from "~components/BotNav";

function Main() {
  const { user, getHTMLData, pageData, page, setPage } = useSearchContext();

  const [isNewUser, setIsNewUser] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(true);

  const readFromDB = useReadDB()
 
  const handleDetectChange = useDetectChange();

  React.useEffect(() => {
    if (user && !isNewUser) {
      readFromDB(user.uid)
      setPage('/choose');
    }else if(user && isNewUser){
      setPage('/preferences')
    }
  }, [user]);
  
  useEffect(() => {
    handleDetectChange();
  }, []);

  // Add event listener for tab changes
  useEffect(() => {
    const handleTabChange = (activeInfo) => {
      if (activeInfo && activeInfo[0]) {
        getHTMLData(activeInfo[0]);
      }
    };

    // Add the event listener for tab changes
    chrome.tabs.onActivated.addListener((activeInfo) => {
      handleTabChange(activeInfo);
    });

    // Call getHTMLData for the currently active tab when the component mounts
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (currentTab) {
        getHTMLData(currentTab);
      }
    });

    // Clean up the event listener when the component unmounts
    return () => {
      chrome.tabs.onActivated.removeListener(handleTabChange);
    };
  }, []); // Empty dependency array means this effect runs only once on mount

  
  const setIsNewUserToFalse = () => {
    setIsNewUser(false);
  };

  const renderContent = () => {
    if (page === "/similar") {
      return <Similiar data={pageData} />;
    } 
    else if (page === "/same") {
      return <Same data={pageData} />;
    }
    else if (page === "/preferences"){
      return <Preferences setIsNewUserToFalse={setIsNewUserToFalse}/>;
    }
    else if (page === "/choose"){

      return <Choose data={pageData} />
    }
    else if (page === '/Profile'){
      return <Profile/>
    }
    else if (page === '/History'){
      return <DisplayHistory/>
    }
    else if (page === '/Contact'){
      return <ContactUs/>
    }

  };


  return (
    <div className="w-[400px] h-[580px]">
    <TopBar />
    {user != null ? (
      isNewUser ? (
        <>{renderContent()}</>
      ) : (
        <div>
          <div className={`px-5 ${page === "/Profile" ? "px-3" : ""}`}>
            {renderContent()}
          </div>
          {/* <Signout /> */}
          <BotNav />
        </div>
      )
    ) : showLoginForm ? (
      <Login
        setIsNewUser={setIsNewUser}
        setShowLoginForm={setShowLoginForm}
        showLoginForm={showLoginForm}
      />
    ) : (
      <Signup
        setIsNewUser={setIsNewUser}
        setShowLoginForm={setShowLoginForm}
        showLoginForm={showLoginForm}
      />
    )}
  </div>
);
}

export default Main;
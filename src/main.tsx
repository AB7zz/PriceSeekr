import React, { useEffect, useState } from "react";
import "~base.css";
import "~style.css";
import Similiar from "~features/similiar";
import Same from "~features/same";
import Preferences from '~components/preferences';
import Signout from '~components/Signout'
import Login from '~components/Login'
import Signup from '~components/Signup'
import TopBar from "~components/TopBar";
import { useSearchContext } from "~context/SearchContext";
import Choose from "~components/Choose";
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
    console.log(user, isNewUser)
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

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (currentTab) {
        getHTMLData(currentTab);
      }
    });
  }, []);
  
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
  };


  return (
    <div className="w-[360px]">
      <TopBar />
      {user != null ? (
        isNewUser ? (
          <>
            {renderContent()}
          </>
        ) : (
          <div>
            <div className='px-10'>
              {renderContent()}
            </div>
            <Signout />
            <BotNav />
          </div>
        )
      ) : showLoginForm ? (
        <Login setIsNewUser={setIsNewUser} setShowLoginForm={setShowLoginForm} showLoginForm={showLoginForm} />
      ) : (
        <Signup setIsNewUser={setIsNewUser} setShowLoginForm={setShowLoginForm} showLoginForm={showLoginForm} />
      )}
    </div>
  );
}

export default Main;

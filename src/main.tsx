import React, { useEffect, useState } from "react";
import "~base.css";
import "~style.css";
import Similiar from "~features/similiar";
import Same from "~features/same";
import Preferences from '~features/preferences';
import Navbar from "~components/Navbar";
import TopBar from "~components/TopBar";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useSearchContext } from "~context/SearchContext";
import {
  useSignOut,
  useGoogleLogin,
  useDetectChange,
  useEmailSignUp,
  useEmailSignIn,
} from "~firebase/hooks";
import BotNav from "~components/BotNav";

function Main() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isNewUser, setIsNewUser] = useState(
    // Check if 'isNewUser' is set in localStorage and parse it as a boolean
    localStorage.getItem("isNewUser") === "true"
  );

  const handleSignOut = useSignOut();
  const handleEmailSignIn = useEmailSignIn(setIsNewUser);
  const handleEmailSignUp = useEmailSignUp(setIsNewUser);
  const handleGoogleLogin = useGoogleLogin(setIsNewUser);

  const handleDetectChange = useDetectChange();
  const [showLoginForm, setShowLoginForm] = useState(true);
  const { user, getHTMLData, pageData, page, setPage } = useSearchContext();

  React.useEffect(() => {
    if (isNewUser && user) {
      console.log("page set to pref")
      setPage('/preferences');
    }else if(!isNewUser && user){
      console.log("page being set to similar")
      setPage('/similar');
    }
  }, [isNewUser,user]);
  useEffect(() => {
    handleDetectChange();
  }, []);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      if (currentTab) {
        console.log("Popup clicked - Tab", currentTab);
        getHTMLData(currentTab);
      }
    });
  }, []);

  const renderContent = () => {
    if (page === "/similar") {
      console.log("page set to similar")
      return <Similiar data={pageData} />;
    } 
    else if (page === "/same") {
      return <Same data={pageData} />;
    }
    else if (page === "/preferences"){
      return <Preferences/>;
    }
  };

  const toggleLoginMode = () => {
    setShowLoginForm(!showLoginForm);
  };

  return (
    <>
      {user ? (
        isNewUser ? (
          <>
            <TopBar />
            {renderContent()}
          </>
        ) : (
          <div>
            <TopBar />
            {renderContent()}
            <button
              className="bg-red-500 hover:bg-red-600 text-white text-base rounded-lg py-2.5 px-5 transition-colors w-full mt-4"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
            <BotNav />
          </div>
        )
      ) : showLoginForm ? (
        <div className="px-2 py-5 w-[360px] flex justify-center">
          <form>
            <input
              type="text"
              className="w-full px-6 py-3 mb-2 border border-slate-600 rounded-lg font-medium"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="w-full px-6 py-3 mb-2 border border-slate-600 rounded-lg font-medium"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="bg-slate-500 hover:bg-slate-700 text-white text-base rounded-lg py-2.5 px-5 transition-colors w-full text-[19px]"
              onClick={() => handleEmailSignIn(email, password)}
            >
              Log In
            </button>
          </form>
          <span
            className="mb-2 text-gray-900 cursor-pointer"
            onClick={toggleLoginMode}
          >
            Don't have an account? Sign up
          </span>
          <button
            className="bg-yellow-500 hover:bg-yellow-600 px-2 py-2 rounded-[15px] text-white"
            onClick={handleGoogleLogin}
          >
            <span className="text-gray-700 font-medium">
              Continue with Google
            </span>
          </button>
        </div>
      ) : (
        <div className="px-2 py-5 w-[360px] flex justify-center">
          <form>
            <input
              type="text"
              className="w-full px-6 py-3 mb-2 border border-slate-600 rounded-lg font-medium"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="w-full px-6 py-3 mb-2 border border-slate-600 rounded-lg font-medium"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className="bg-slate-500 hover:bg-slate-700 text-white text-base rounded-lg py-2.5 px-5 transition-colors w-full text-[19px]"
              onClick={() => handleEmailSignUp(email, password)}
            >
              Sign up
            </button>
          </form>
          <span
            className="mb-2 text-gray-900 cursor-pointer"
            onClick={toggleLoginMode}
          >
            Already have an account? Log in
          </span>
          <button
            className="bg-yellow-500 hover:bg-yellow-600 px-2 py-2 rounded-[15px] text-white"
            onClick={handleGoogleLogin}
          >
            <span className="text-gray-700 font-medium">
              Continue with Google
            </span>
          </button>
        </div>
      )}
    </>
  );
}

export default Main;

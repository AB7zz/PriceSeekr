import React, { useEffect, useState } from "react";
import "~base.css";
import "~style.css";
import Similiar from "~features/similiar";
import Same from "~features/same";
import Preferences from '~components/preferences';
import Navbar from "~components/Navbar";
import TopBar from "~components/TopBar";
import GoogleIcon from '@mui/icons-material/Google';
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

  const [error, setError] = useState(""); // Error state for login/signup

  const handleSignOut = useSignOut();
  const handleEmailSignIn = useEmailSignIn(setIsNewUser, setError);
  const handleEmailSignUp = useEmailSignUp(setIsNewUser, setError);
  const handleGoogleLogin = useGoogleLogin(setIsNewUser, setError);
 
  const handleDetectChange = useDetectChange();
  const [showLoginForm, setShowLoginForm] = useState(true);
  const { user, getHTMLData, pageData, page, setPage } = useSearchContext();

  React.useEffect(() => {
    if (isNewUser && user) {
      setPage('/preferences');
    } else if (!isNewUser && user) {
      setPage('/similar');
    }
  }, [isNewUser, user]);
  
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

  const renderContent = () => {
    if (page === "/similar") {
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
    setError(""); // Clear any previous error messages when toggling login/signup
  };

  return (
    <>
      <TopBar />
      {user ? (
        isNewUser ? (
          <>
            {renderContent()}
          </>
        ) : (
          <div>
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
        <>
        <div className="px-2 mt-5 py-5 w-[360px] flex flex-col justify-center items-center">
          <form className="block px-10">
            <input
              type="text"
              className="!border-none bg-[#D9D9D9] text-[#989898] font-medium poppins w-full px-5 py-3 border border-slate-600 rounded-lg"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="!border-none bg-[#D9D9D9] text-[#989898] font-medium poppins w-full px-5 py-3 mt-5 border border-slate-600 rounded-lg"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p
              className="my-2 text-black font-semibold cursor-pointer"
              onClick={toggleLoginMode}
            >
              Don't have an account? <span className="text-blue-500">Sign up</span>
            </p>
            <div className="flex justify-center">
              <button
                type="button"
                className="mt-5 bg-[#FF9C1A] hover:bg-[#E38A16] text-white text-base rounded-[5px] py-2 px-10 text-[19px]"
                onClick={() => handleEmailSignIn(email, password)}
              >
                Log In
              </button>
            </div>
          </form>
        </div>
        <div className="px-5">
          <div className="flex justify-around items-center">
            <hr className="border-[#C5C5C5] border-t-2 w-[100px]" />
            <span className="text-lg text-[#A4A4A4] poppins">OR</span>
            <hr className="border-[#C5C5C5] border-t-2 w-[100px]" />
          </div>
          <div className="flex justify-center py-5">
            <button
              className="bg-[#CF4332] hover:bg-[#AB3324] px-7 py-2 rounded-[5px] text-white font-semibold"
              onClick={handleGoogleLogin}
            >
              <GoogleIcon className="text-white mr-3" />
              Continue with Google
            </button>
            <p className="text-red-500 mt-2">{error}</p> {/* Display error message */}
          </div>
        </div>
        </>
      ) : (
        <>
        <div className="px-2 mt-5 py-5 w-[360px] flex flex-col justify-center items-center">
          <form className="px-10">
            <input
              type="text"
              className="!border-none bg-[#D9D9D9] text-[#989898] font-medium poppins w-full px-5 py-3 border border-slate-600 rounded-lg"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="!border-none bg-[#D9D9D9] text-[#989898] font-medium poppins w-full px-5 py-3 mt-5 border border-slate-600 rounded-lg"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p
                className="my-2 text-black font-semibold cursor-pointer"
                onClick={toggleLoginMode}
              >
              Already have an account? <span className="text-blue-500">Log in</span>
            </p>
            <div className="flex justify-center">
              <button
                type="button"
                className="mt-5 bg-[#FF9C1A] hover:bg-[#E38A16] text-white text-base rounded-[5px] py-2 px-10 text-[19px]"
                onClick={() => handleEmailSignUp(email, password)}
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
        <div className="px-5">
          <div className="flex justify-around items-center">
            <hr className="border-[#C5C5C5] border-t-2 w-[100px]" />
            <span className="text-lg text-[#A4A4A4] poppins">OR</span>
            <hr className="border-[#C5C5C5] border-t-2 w-[100px]" />
          </div>
          <div className="flex justify-center py-5">
            <button
              className="bg-[#CF4332] hover:bg-[#AB3324] px-7 py-2 rounded-[5px] text-white font-semibold"
              onClick={handleGoogleLogin}
            >
              <GoogleIcon className="text-white mr-3" />
              Continue with Google
            </button>
            <p className="text-red-500 mt-2">{error}</p> {/* Display error message */}
          </div>
        </div>
        </>
      )}
    </>
  );
}

export default Main;

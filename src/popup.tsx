import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"
import "~base.css"
import "~style.css"
import Similiar from "~features/similiar"
import Same from "~features/same"
import Navbar from "~components/Navbar"
import { MySearchProvider } from "~context/SearchContext"
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.PLASMO_PUBLIC_FIREBASE_PUBLIC_API_KEY,
  authDomain: process.env.PLASMO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.PLASMO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.PLASMO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.PLASMO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.PLASMO_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.PLASMO_PUBLIC_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);

function IndexPopup() {
  const [page, setPage] = useState('/similiar');
  const [pageData, setPageData] = useState(null);
  const [user, setUser] = useState(null); 

  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    });

    return () => unsubscribe(); // Clean up the listener
  }, [auth]);

  const handleGoogleLogin = async () => {
    chrome.identity.getAuthToken({ interactive: true }, async function (token) {
      if (chrome.runtime.lastError || !token) {
        console.error(chrome.runtime.lastError)
        return
      }
      if (token) {
        const credential = GoogleAuthProvider.credential(null, token)
        try {
          await signInWithPopup(auth, credential)
        } catch (e) {
          console.error("Could not log in. ", e)
        }
      }
    })
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0];
      const getHTMLData = async(tab: any) => {
        try {
            if (tab) {
                const [result] = await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: () => {
                        const productTitle = document.querySelector('#productTitle').innerHTML
                        const image = document.querySelector('#landingImage') != null ? document.querySelector('#landingImage').getAttribute('src') : document.querySelector("img.a-dynamic-image").getAttribute('src')
                        const price = document.querySelector('.a-offscreen').innerHTML
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
  };
  return (
    <>
      <MySearchProvider>
       
        {user ? (
          <div>
            <p>Welcome, {user.displayName}</p>

            <button onClick={handleSignOut}>Sign Out</button>
          </div>
        ) : (
          <button onClick={handleGoogleLogin}>Sign In with Google</button>
        )}
        <Navbar setPage={setPage} page={page} />    
        {renderContent()}
        {page === "/" ? (
          <div className="flex py-5">
            <button
              onClick={() => setPage('/similiar')}
              className='m-auto bg-sky-500 text-white px-5 py-2 rounded'
            >
              View similar products
            </button>
            <button
              onClick={() => setPage('/same')}
              className='m-auto bg-sky-500 text-white px-5 py-2 rounded'
            >
              View Same products
            </button>
          </div>
        ) : (
          <></>
        )}
      </MySearchProvider>
    </>
  );
}

export default IndexPopup
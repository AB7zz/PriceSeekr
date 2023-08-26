import type { PlasmoCSConfig } from "plasmo"
import { useEffect, useState } from "react"
import "~base.css"
import "~style.css"
import Similiar from "~features/similiar"
import Same from "~features/same"
import Navbar from "~components/Navbar"
import TopBar from "~components/TopBar"
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { initializeApp } from "firebase/app";
import { useSearchContext } from "~context/SearchContext"
import {
  getAuth,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  signInWithCredential,
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

function Main() {
  const [page, setPage] = useState('/similiar');
  const [pageData, setPageData] = useState(null);
  const [user, setUser] = useState(null);
//   const {user, setUser} = useSearchContext()

  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      console.log(user)
    });

    return () => unsubscribe();
  }, []);

  const handleGoogleLogin = async () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("User is already logged in:", user);
      } else {
        console.log("No user is currently logged in.");
        chrome.identity.getAuthToken({ interactive: true }, async function (token) {
          if (chrome.runtime.lastError || !token) {
            console.error(chrome.runtime.lastError)
            return
          }
          if (token) {
            // const credential = new GoogleAuthProvider()
            const credential = GoogleAuthProvider.credential(null, token)
            try {
              // await signInWithPopup(auth, credential)
              await signInWithCredential(auth, credential)
            } catch (e) {
              console.error("Could not log in. ", e)
            }
          }
        })
      }
    });
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
       
        {user ? (
          <div>
            {/* <TopBar name={user.displayName} /> */}
            <div className='bg-yellow-500 px-5 py-2 flex justify-between m-auto'>
              <div className="flex">
                <AccountCircleIcon className="text-white text-lg" /> 
                <p className="ml-3 text-lg text-white font-bold">{user.displayName} !</p>
              </div>
              <div>
                <button className="bg-white px-3 py-1 rounded-[10px] text-yellow-500 font-semibold text-center" onClick={handleSignOut}>Sign Out</button>
              </div>
            </div>
            <Navbar setPage={setPage} page={page} />    
            {renderContent()}
          </div>
        ) : (
          <div className="px-2 py-5 w-[250px] flex justify-center">
            <button className="bg-yellow-500 hover:bg-yellow-600 px-2 py-2 rounded-[15px] text-white" onClick={handleGoogleLogin}>Sign In with Google</button>
          </div>
        )}
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
    </>
  );
}

export default Main
import {
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    signInWithCredential,
} from "firebase/auth";
import React from "react";
import { useSearchContext } from "~context/SearchContext";
import { auth } from "~firebase"

export const useSignOut = () => {
  const { setUser } = useSearchContext()
  const handleSignOut = async() => {
    try {
      chrome.browsingData.removeCache({}, () => {
        console.log('Cache cleared.');
      });
      await signOut(auth);
      setUser(null)
    } catch (error) {
      console.error("Sign out error:", error);
    }
  }
  return handleSignOut
};

export const useDetectChange = () => {
  const { setUser } = useSearchContext();
  const handleDetectChange = () => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      console.log(user);
    });

    return () => unsubscribe();
  };

  return handleDetectChange;
};


export const useGoogleLogin = () => {
  const {setUser, user} = useSearchContext()
  const handleGoogleLogin = async() => {
    if (user) {
      console.log("User is already logged in:", user);
      setUser(user)
    } else {
      console.log("No user is currently logged in.");
      chrome.identity.getAuthToken({ interactive: true }, async function (token) {
        if (chrome.runtime.lastError || !token) {
          console.error('Chrome error: ', chrome.runtime.lastError)
          return
        }
        if (token) {
          chrome.identity.removeCachedAuthToken({token:token},function(){
            console.log('O',token)
            chrome.identity.getAuthToken({ interactive: true }, async function (token2) {
              if (chrome.runtime.lastError || !token2) {
                console.error('Chrome error: ', chrome.runtime.lastError)
                return
              }
              if (token2) {
                console.log('N',token2)
                const credential = GoogleAuthProvider.credential(null, token2)
                try {
                  const res = await signInWithCredential(auth, credential)
                  setUser(res.user)
                  console.log(res.user)
                } catch (e) {
                  console.error("Could not log in. ", e)
                }
              }
            })
          });
        }
      })
    }
  }

  return handleGoogleLogin
};

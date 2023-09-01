import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import { useSearchContext } from "~context/SearchContext";
import { auth } from "~firebase";

export const useSignOut = () => {
  const { setUser } = useSearchContext();
  const handleSignOut = async () => {
    try {
      chrome.browsingData.removeCache({}, () => {
        console.log('Cache cleared.');
      });
      await signOut(auth);
      localStorage.clear();
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };
  return handleSignOut;
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


export const useGoogleLogin = (setIsNewUserCallback) => {
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
            console.log('R',token)
          });
          chrome.identity.clearAllCachedAuthTokens(() => {
            console.log('C')
          });
          chrome.identity.getAuthToken({ interactive: true }, async function (token2) {
            if (chrome.runtime.lastError || !token2) {
              console.error('Chrome error: ', chrome.runtime.lastError)
              return
            }
            if (token2) {
              console.log('G',token2)
              const credential = GoogleAuthProvider.credential(null, token2)
              try {
                const res = await signInWithCredential(auth, credential)
                setUser(res.user)
                setIsNewUserCallback(false);
                console.log(res.user)
              } catch (e) {
                console.error("Could not log in. ", e)
              }
            }
          })
        }
      })
    }
  }

  return handleGoogleLogin
};

export const useEmailSignIn = (setIsNewUserCallback) => {
  const { setUser } = useSearchContext();

  const handleEmailSignIn = async (email, password) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      setUser(res.user);
      setIsNewUserCallback(false);
    } catch (error) {
      console.error("Email sign-in error:", error);
    }
  };

  return handleEmailSignIn;
};

export const useEmailSignUp = (setIsNewUserCallback) => {
  const { setUser } = useSearchContext();

  const handleEmailSignUp = async (email, password) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      setUser(res.user);
      setIsNewUserCallback(true);
    } catch (error) {
      console.error("Email sign-up error:", error);
    }
  };

  return handleEmailSignUp;
};

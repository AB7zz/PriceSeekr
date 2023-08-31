import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import React from "react";
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

export const useGoogleLogin = () => {
  const { setUser, user } = useSearchContext();

  const handleGoogleLogin = async () => {
    if (user) {
      console.log("User is already logged in:", user);
    } else {
      console.log("No user is currently logged in.");

      chrome.identity.getAuthToken({ interactive: true }, async function (token) {
        if (chrome.runtime.lastError || !token) {
          console.error(chrome.runtime.lastError);
          return;
        }
        if (token) {
          const credential = new GoogleAuthProvider();
          try {
            const res = await signInWithPopup(auth, credential);
            setUser(res.user);
          } catch (e) {
            console.error("Could not log in. ", e);
          }
        }
      });
    }
  };

  return handleGoogleLogin;
};

export const useEmailSignIn = () => {
  const { setUser } = useSearchContext();

  const handleEmailSignIn = async (email, password) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      setUser(res.user);
    } catch (error) {
      console.error("Email sign-in error:", error);
    }
  };

  return handleEmailSignIn;
};

export const useEmailSignUp = () => {
  const { setUser } = useSearchContext();

  const handleEmailSignUp = async (email, password) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      setUser(res.user);
    } catch (error) {
      console.error("Email sign-up error:", error);
    }
  };

  return handleEmailSignUp;
};

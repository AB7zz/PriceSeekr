import {
    getAuth,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup,
    signOut,
    signInWithCredential,
} from "firebase/auth";
import { app, auth } from "~firebase"

export const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out error:", error);
    }
};

export const handleGoogleLogin = async () => {
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
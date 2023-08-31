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

// export const useGoogleLogin = () => {
//   const { setUser, user } = useSearchContext();

//   const handleGoogleLogin = async () => {
//     if (user) {
//       console.log("User is already logged in:", user);
//     } else {
//       console.log("No user is currently logged in.");
//       const redirectURL = chrome.identity.getRedirectURL();
//       const clientID =
//         "43535114296-5pjd4u7innrcvo39609hud4fupputtu1.apps.googleusercontent.com";
//       const scopes = ["openid", "email", "profile"];
//       let authURL = "https://accounts.google.com/o/oauth2/auth";
//       authURL += `?client_id=${clientID}`;
//       authURL += `&response_type=token`;
//       authURL += `&redirect_uri=${encodeURIComponent(redirectURL)}`;
//       authURL += `&scope=${encodeURIComponent(scopes.join(" "))}`;

//       chrome.identity.launchWebAuthFlow({
//         interactive: true,
//         url: authURL,
//       });
//           chrome.identity.getAuthToken({ interactive: true }, async function (token) {
//         if (chrome.runtime.lastError || !token) {
//           console.error(chrome.runtime.lastError);
//           return;
//         }
//         if (token) {
//           const credential = new GoogleAuthProvider();
//           // const credential = GoogleAuthProvider.credential(null, token)
//           try {
//             const res = await signInWithPopup(auth, credential);
//             setUser(res.user);
//             // await signInWithCredential(auth, credential)
//           } catch (e) {
//             console.error("Could not log in. ", e);
//           }
//         }
//       });
//     }
//   };

//   return handleGoogleLogin;
// };




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
              console.log('D',token2)
              
              // const credential = new GoogleAuthProvider()
              const credential = GoogleAuthProvider.credential(null, token2)
              try {
                const res = await signInWithCredential(auth, credential)
                // const res = await signInWithPopup(auth, credential)
                setUser(res.user)
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

import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useSearchContext } from "~context/SearchContext";
import { auth, colRef } from "~firebase";
import { getFirestore, doc, getDoc, setDoc, snapshotEqual } from 'firebase/firestore';


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

export const useGoogleLogin = (setIsNewUserCallback, setErrorCallback) => {
  const { setUser, user } = useSearchContext();

  const handleGoogleLogin = async () => {
    if (user) {
      console.log("User is already logged in:", user);
      setUser(user);
    } else {
      console.log("No user is currently logged in.");
      chrome.identity.getAuthToken({ interactive: true }, async function (token) {
        if (chrome.runtime.lastError || !token) {
          console.error('Chrome error: ', chrome.runtime.lastError);
          setErrorCallback('Error logging in with Google');
          return;
        }
        if (token) {
          chrome.identity.removeCachedAuthToken({ token: token }, function () {
            console.log('R', token);
          });
          chrome.identity.clearAllCachedAuthTokens(() => {
            console.log('C');
          });
          chrome.identity.getAuthToken({ interactive: true }, async function (token2) {
            if (chrome.runtime.lastError || !token2) {
              console.error('Chrome error: ', chrome.runtime.lastError);
              setErrorCallback('Error logging in with Google');
              return;
            }
            if (token2) {
              console.log('G', token2);
              const credential = GoogleAuthProvider.credential(null, token2);
              try {
                const res = await signInWithCredential(auth, credential);
                setUser(res.user);
                setIsNewUserCallback(false);
                console.log(res.user);
              } catch (e) {
                // console.error("Could not log in. ", e);
                setErrorCallback(e.code);
              }
            }
          });
        }
      });
    }
  };

  return handleGoogleLogin;
};

export const useEmailSignIn = (setIsNewUserCallback, setErrorCallback) => {
  const { setUser } = useSearchContext();

  const handleEmailSignIn = async (email, password) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      setUser(res.user);
      setIsNewUserCallback(false);
    } catch (error) {
      // console.error("Email sign-in error:", error);
      setErrorCallback(error.code);
    }
  };

  return handleEmailSignIn;
};

export const useEmailSignUp = (setIsNewUserCallback, setErrorCallback) => {
  const { setUser } = useSearchContext();

  const handleEmailSignUp = async (email, password) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      setIsNewUserCallback(true);
      setUser(res.user);
    } catch (error) {
      setErrorCallback(error.code);
    }
  };

  return handleEmailSignUp;
};

export const useWriteToDB = () => {
  const user = auth.currentUser;
  const {setPage} = useSearchContext()
  const handleWriteToDB = async(preferences) => {
    if (user) {
      const userId = user.uid;
      const userEmail = user.email;
  
      const userDocRef = doc(colRef, userId);
      try {
        await setDoc(userDocRef, {
          Email: userEmail,
          History: ['amazon.com'],
          Preferences: preferences,
          Theme: true,
          
        });
        console.log('Data written to Firestore successfully');
        setPage('/choose')
      } catch (error) {
        console.error('Error writing to Firestore:', error);
      }
    }
  }
  return handleWriteToDB
};

export const useReadDB = () => {
  const {setPreferences} = useSearchContext()

  const readFromDB = async (userId) => {
    const userDocRef = doc(colRef, userId);

    try {
      const docSnapshot = await getDoc(userDocRef);

      if (docSnapshot.exists()) {
        setPreferences(docSnapshot.data().Preferences)
        const userData = docSnapshot.data();
        console.log('User data:', userData);
      } else {
        console.log('No data available');
      }
    } catch (error) {
      console.error('Error reading from Firestore:', error);
    }
  };

  return readFromDB;
};
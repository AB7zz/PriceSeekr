import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useSearchContext } from "~context/SearchContext";
import { auth, database } from "~firebase";
import { ref, set, get } from 'firebase/database';

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
  const { setUser, user, setPage } = useSearchContext();

  const handleGoogleLogin = async () => {
    if (user) {
      console.log("User is already logged in:", user);
      setUser(user);
      setPage('/choose')
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
                setPage('/choose')
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
  const { setUser, setPage } = useSearchContext();

  const handleEmailSignIn = async (email, password) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      setUser(res.user);
      setIsNewUserCallback(false);
      setPage('/choose')
    } catch (error) {
      setErrorCallback(error.code);
    }
  };

  return handleEmailSignIn;
};

export const useEmailSignUp = (setIsNewUserCallback, setErrorCallback) => {
  const { setUser, setPage } = useSearchContext();

  const handleEmailSignUp = async (email, password) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      setIsNewUserCallback(true);
      setUser(res.user);
      setPage('/preferences')
    } catch (error) {
      setErrorCallback(error.code);
    }
  };

  return handleEmailSignUp;
};

export const useWriteToDB = () => {
  const user = auth.currentUser;
  const userEmail = user.email; 
  const {setPage} = useSearchContext()
  const writeToDB = (preferences) => {
    if (user) 
    {
        const userId = user.uid; // This is the Firebase Authentication User ID
        const db = database;
        const history = [
            'https://www.amazon.com/product1',
            'https://www.ebay.com/product2',
            'https://www.walmart.com/product3'
        ];
  
        // Write user data to the database using the User ID as the key
        set(ref(db, 'Users/' + userId), {
            Theme: true, // Change this to a boolean value
            Preferences: preferences,
            History: history,
            Email: userEmail
        });
  
        setPage('/choose')
    }
  }
  return writeToDB
}

export const useReadDB = () => {
  const {setPreferences, setUserData} = useSearchContext()
  const readFromDB = (userId) => {
    const db = database;
    const dbRef = ref(db, 'Users/' + userId);
    get(dbRef).then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
        setUserData(snapshot.val())
        setPreferences(snapshot.val().Preferences)
      } else {
        console.log("No data available");
      }
    }).catch((error) => {
      console.error(error);
    });
  }
  return readFromDB
}
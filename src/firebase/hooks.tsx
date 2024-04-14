import {
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth/web-extension";
import { useSearchContext } from "~context/SearchContext";
import { auth, colRef } from "~firebase";
import { doc, getDoc, setDoc } from 'firebase/firestore';


const mapFirebaseErrorToMessage = (errorCode) => {
  switch (errorCode) {
    case "auth/invalid-email":
      return "Invalid email address.";
    case "auth/user-not-found":
      return "User not found. Please sign up first.";
    case "auth/wrong-password":
      return "Incorrect password.";
    case "auth/weak-password":
      return "Password is too weak. Please use a stronger password.";
    default:
      return "An error occurred. Please try again later.";
  }
};


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
  const { setUser,setEmail } = useSearchContext();
  const handleDetectChange = () => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setEmail(user.email)
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
  const { setUser, setEmail } = useSearchContext();

  const handleEmailSignIn = async (email, password) => {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      setUser(res.user);
      setEmail(res.user.email);
      setIsNewUserCallback(false);
    } catch (error) {
      const errorMessage = mapFirebaseErrorToMessage(error.code);
      setErrorCallback(errorMessage);
    }
  };

  return handleEmailSignIn;
};

export const useEmailSignUp = (setIsNewUserCallback, setErrorCallback) => {
  const { setUser, setEmail } = useSearchContext();

  const handleEmailSignUp = async (email, password) => {
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      setIsNewUserCallback(true);
      setUser(res.user);
      setEmail(res.user.email);
    } catch (error) {
      const errorMessage = mapFirebaseErrorToMessage(error.code);
      setErrorCallback(errorMessage);
    }
  };

  return handleEmailSignUp;
};
export const useWriteToDB = () => {
  const user = auth.currentUser;
  const {setPage} = useSearchContext()
  const handleWriteToDB = async(preferences) => {
    console.log('called useWriteToDB')
    if (user) {
      const userId = user.uid;
      const userEmail = user.email;
      console.log(userId, userEmail)
      const userDocRef = doc(colRef, userId);
      try {
        await setDoc(userDocRef, {
          Email: userEmail,
          History: {},
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

export const useSaveSearchResultToFirestore = () => {
  const user = auth.currentUser;
  const saveSearchResultToFirestore = async (SearchData, PageData, isSame, apiCalls) => {
    console.log('called saveSearchResultToFirestore')
    if (user) {
      const userId = user.uid;
      const userDocRef = doc(colRef, userId);
      try {
        // Get the existing data from Firestore
        const userDocSnapshot = await getDoc(userDocRef);
        const userData = userDocSnapshot.data();
  
        // Create or update the 'History' field in the user's document
        if (!userData.History) {
          userData.History = {};
        }

        userData.APICalls = apiCalls
        
        // Create or update the 'PageData' field within 'History'
        if (!userData.History.PageData) {
          userData.History.PageData = [];
        }
        if(isSame)
        {
            // Insert PageData as the first element of the PageData array
            userData.History.PageData.unshift({
              PageDetails: PageData,
              SearchRes: SearchData.map((product) => ({
                thumbnail: product.thumbnail,
                title: product.title,
                url: product.link,
                price: product.price.extracted_value,
                company: product.source,
              })),
            });
        }else
        {
          const date = new Date();
            // Insert PageData as the first element of the PageData array
            userData.History.PageData.unshift({
              PageDetails: PageData,
              SearchRes: SearchData.map((product) => ({
                thumbnail: product.thumbnail,
                title: product.title,
                url: product.link,
                price: product.extracted_price,
                company: product.source,
                searchDate: date
              })),
            });
         }
  
        // Update the user's document in Firestore
        await setDoc(userDocRef, userData);
  
        console.log('Search results saved to Firestore successfully');
      } catch (error) {
        console.error('Error saving search results to Firestore:', error);
      }
    } else {
      console.log('User not authenticated. Unable to save search results.');
    }
  }
  return saveSearchResultToFirestore
};



export const useReadDB = () => {
  const {setPreferences, setAPICalls} = useSearchContext()
  
  const readFromDB = async (userId) => {
    console.log('called useReadDB')
    const userDocRef = doc(colRef, userId);
    try {
      const docSnapshot = await getDoc(userDocRef);

      if (docSnapshot.exists()) {
        setPreferences(docSnapshot.data().Preferences)
        setAPICalls(docSnapshot.data().APICalls || 0)
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


export const useUpdateDB = () => {
  const user = auth.currentUser;
  const { setPage, setPreferences } = useSearchContext();
  
  const updateToDB = async (updatedData) => {
    console.log('called useUpdateDB')
    if (user) {
      const userId = user.uid;
      const userDocRef = doc(colRef, userId);


      try {
        await setDoc(userDocRef, updatedData, { merge: true });
        console.log('Data updated in Firestore successfully');
        
        // Update global state if Preferences are updated
        if (updatedData.Preferences) {
          setPreferences(updatedData.Preferences);
        }
      } catch (error) {
        console.error('Error updating data in Firestore:', error);
      }
    }
  };

  return updateToDB;
};

export const readHistoryDB = () => {
  const { setHistory } = useSearchContext();
  
  const readHistory = async (userId) => {
    console.log('called readHistoryDB')
    const userDocRef = doc(colRef, userId);
    
    try {
      const docSnapshot = await getDoc(userDocRef);

      if (docSnapshot.exists()) {
        setHistory(docSnapshot.data().History);
      } else {
        console.log('No history data available');
      }
    } catch (error) {
      console.error('Error reading history data from Firestore:', error);
    }
  };

  return readHistory;
};
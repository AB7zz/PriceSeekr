import React, {useState} from 'react'
import {
    useEmailSignUp,
    useGoogleLogin
} from "~firebase/hooks";
import GoogleIcon from '@mui/icons-material/Google';
import { useSearchContext } from '~context/SearchContext'

const Signup = ({setIsNewUser, setShowLoginForm, showLoginForm}) => {
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const {darkTheme} = useSearchContext()
    const [password, setPassword] = useState("");
    const handleEmailSignUp = useEmailSignUp(setIsNewUser, setError);
    const handleGoogleLogin = useGoogleLogin(setIsNewUser, setError);
    const toggleLoginMode = () => {
        setShowLoginForm(!showLoginForm);
        setError(""); // Clear any previous error messages when toggling login/signup
    };
    return (
      <div className="px-5">
        <div className="px-2 py-5 flex flex-col justify-center items-center">
          <form className="px-10">
            <input
              type="text"
              className="!border-none bg-[#D9D9D9] text-[#989898] font-medium poppins w-full px-5 py-3 border border-slate-600 rounded-lg"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              className="!border-none bg-[#D9D9D9] text-[#989898] font-medium poppins w-full px-5 py-3 mt-5 border border-slate-600 rounded-lg"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p
                className={`my-2 ${darkTheme ? 'text-white' : 'text-black'} font-semibold cursor-pointer`}
                onClick={toggleLoginMode}
              >
              Already have an account? <span className="text-blue-500">Log in</span>
            </p>
            <div className="flex justify-center">
              <button
                type="button"
                style={{padding: '10px', borderRadius: '5px', width: '100%'}}
                className="loginSignupBtn mt-5 bg-[#e0821e] hover:bg-[#E38A16] text-white text-base rounded-[5px] py-2 px-10 text-[19px]"
                onClick={() => handleEmailSignUp(email, password)}
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
        <div className="px-5">
        
          <div style={{justifyContent: 'center'}} className="flex items-center">
            <div className="flex-grow border-t-2 border-gray-400"></div>
            <span className={`text-sm ${darkTheme ? 'text-white font-semibold' : 'text-[#A4A4A4]'} poppins`}>OR</span>
            <div className="flex-grow border-t-2 border-gray-400"></div>
          </div>
          <div className="flex flex-col justify-center py-5">
            <button
              style={{background: '#CF4332', borderRadius: '5px', width: '100%', justifyContent: 'center'}}
              className="googleBtn bg-[#CF4332] hover:bg-[#AB3324] px-7 py-2 rounded-[5px] text-white font-semibold"
              onClick={handleGoogleLogin}
            >
              <GoogleIcon className="text-white mr-3" />
              Continue with Google
            </button>
            <p style={{color: 'red', textAlign: 'center'}} className="text-center text-red-500 mt-2">{error}</p> {/* Display error message */}
          </div>
        </div>
      </div>
  )
}

export default Signup
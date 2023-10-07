import React, {useState} from 'react'
import {
    useEmailSignUp,
    useGoogleLogin
} from "~firebase/hooks";
import GoogleIcon from '@mui/icons-material/Google';

const Signup = ({setIsNewUser, setShowLoginForm, showLoginForm}) => {
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleEmailSignUp = useEmailSignUp(setIsNewUser, setError);
    const handleGoogleLogin = useGoogleLogin(setIsNewUser, setError);
    const toggleLoginMode = () => {
        setShowLoginForm(!showLoginForm);
        setError(""); // Clear any previous error messages when toggling login/signup
    };
    return (
    <>
        <div className="px-2 mt-5 py-5 flex flex-col justify-center items-center">
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
                className="my-2 text-black font-semibold cursor-pointer"
                onClick={toggleLoginMode}
              >
              Already have an account? <span className="text-blue-500">Log in</span>
            </p>
            <div className="flex justify-center">
              <button
                type="button"
                style={{padding: '10px', borderRadius: '5px'}}
                className="mt-5 bg-[#FF9C1A] hover:bg-[#E38A16] text-white text-base rounded-[5px] py-2 px-10 text-[19px]"
                onClick={() => handleEmailSignUp(email, password)}
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
        <div className="px-5">
          <div style={{justifyContent: 'center'}} className="flex items-center">
            <hr className="border-[#C5C5C5] border-t-2 w-[100px]" />
            <span className="text-lg text-[#A4A4A4] poppins">OR</span>
            <hr className="border-[#C5C5C5] border-t-2 w-[100px]" />
          </div>
          <div className="flex justify-center py-5">
            <button
              style={{background: '#CF4332', borderRadius: '5px'}}
              className="bg-[#CF4332] hover:bg-[#AB3324] px-7 py-2 rounded-[5px] text-white font-semibold"
              onClick={handleGoogleLogin}
            >
              <GoogleIcon className="text-white mr-3" />
              Continue with Google
            </button>
            <p className="text-red-500 mt-2">{error}</p> {/* Display error message */}
          </div>
        </div>
        </>
  )
}

export default Signup
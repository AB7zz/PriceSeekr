import React from 'react'
import {
    useEmailSignIn,
    useGoogleLogin
} from "~firebase/hooks";

const Login = ({setIsNewUser, setShowLoginForm, showLoginForm}) => {
    const [error, setError] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const handleEmailSignIn = useEmailSignIn(setIsNewUser, setError);
    const handleGoogleLogin = useGoogleLogin(setIsNewUser, setError);
    const toggleLoginMode = () => {
        setShowLoginForm(!showLoginForm);
        setError(""); // Clear any previous error messages when toggling login/signup
      };
  return (
    <>
        <div className="px-2 mt-5 py-5 w-[360px] flex flex-col justify-center items-center">
          <form className="block px-10">
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
              Don't have an account? <span className="text-blue-500">Sign up</span>
            </p>
            <div className="flex justify-center">
              <button
                type="button"
                className="mt-5 bg-[#FF9C1A] hover:bg-[#E38A16] text-white text-base rounded-[5px] py-2 px-10 text-[19px]"
                onClick={() => handleEmailSignIn(email, password)}
              >
                Log In
              </button>
            </div>
          </form>
        </div>
        <div className="px-5">
          <div className="flex justify-around items-center">
            <hr className="border-[#C5C5C5] border-t-2 w-[100px]" />
            <span className="text-lg text-[#A4A4A4] poppins">OR</span>
            <hr className="border-[#C5C5C5] border-t-2 w-[100px]" />
          </div>
          <div className="flex justify-center py-5">
            <button
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

export default Login
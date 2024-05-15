import React from 'react'
import {
    useSignOut
  } from "~firebase/hooks";

const Signout = () => {
    const handleSignOut = useSignOut();
  return (
    <button
        className="bg-red-500 hover:bg-red-600 text-white text-base rounded-lg py-2.5 px-5 transition-colors w-full mt-4"
        onClick={handleSignOut}
    >
        Sign Out
    </button>
  )
}

export default Signout
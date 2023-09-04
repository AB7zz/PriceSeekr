import React from 'react'
import animation1 from "./animation_im34retq.json"
import Lottie from 'lottie-react'
import { useSearchContext } from '~context/SearchContext'

const Choose = () => {
  const {setPage} = useSearchContext()
  return (
    <div className='px-5 py-7 grid grid-cols-1'>
        <div onClick={() => setPage('/same')} className='bg-[#FFF5ED] cursor-pointer px-5 py-5 rounded-[15px]'>
          <div className="grid grid-cols-1">
            <Lottie animationData={animation1} className='!w-[100px] flex m-auto'/>  
            <div className='flex justify-center'>
              <h3 className="text-black font-semibold poppins textl-2xl">Search Same</h3>
            </div>
          </div>
        </div>
        <hr className="border-[#C5C5C5] border-t-2 w-[200px] flex m-auto my-5" />
        <div onClick={() => setPage('/similar')} className='bg-[#D9D9D9] cursor-pointer px-5 py-5 rounded-[15px]'>
          <div className="grid grid-cols-1">
            <Lottie animationData={animation1} className='!w-[100px] flex m-auto'/>  
            <div className='flex justify-center'>
              <h3 className="text-black font-semibold poppins textl-2xl">Search Similar</h3>
            </div>
          </div>  
        </div>
    </div>
  )
}

export default Choose
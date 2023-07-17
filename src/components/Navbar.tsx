import React from 'react'


const Navbar = ({setPage, page}) => {
  return (
    <div className="bg-gray-100 h-[70px]">
        <div className='flex justify-between h-[100%] w-[100%]'>
            {page == "/similiar" ?
                <div onClick={() => setPage('/similiar')} className='cursor-pointer bg-[#1A1A1A] h-[100%] w-[50%] flex'>
                    <button className='m-auto text-center text-[#FFA800] text-xl font-bold'>Similiar</button>
                </div>
            :
                <div onClick={() => setPage('/similiar')} className='cursor-pointer h-[100%] w-[50%] flex'>
                    <button className='m-auto text-yellow-500 text-xl font-bold'>Similiar</button>
                </div>
            }
            {page == "/same" ?
                <div onClick={() => setPage('/same')} className='cursor-pointer bg-[#1A1A1A] h-[100%] w-[50%] flex'>
                    <button className='m-auto text-center text-[#FFA800] text-xl font-bold'>Same</button>
                </div>
            :
                <div onClick={() => setPage('/same')} className='cursor-pointer h-[100%] w-[50%] flex'>
                    <button className='m-auto text-yellow-500 text-xl font-bold'>Same</button>
                </div>
            }
        </div>
    </div>
  )
}

export default Navbar
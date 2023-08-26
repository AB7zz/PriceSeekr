import React from 'react'

const TopBar = ({name}) => {
  return (
    <div className='bg-gray-500 h-[150px] px-5 py-2 flex justify-center'>
        <p>Welcome {name} !</p>
    </div>
  )
}

export default TopBar
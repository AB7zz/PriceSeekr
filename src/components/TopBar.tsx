import React from 'react'
import logo from 'data-base64:~assets/icon.development.png'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';

const TopBar = () => {
  return (
    <div className='bg-[#F2F2F2] px-5 py-3 flex justify-between'>
        <img className='w-[35px]' src={logo} alt="logo"  />
        <h3 className='text-lg'>PriceSeekr</h3>
        <MoreHorizIcon className='text-[#474747]' />
    </div>
  )
}

export default TopBar
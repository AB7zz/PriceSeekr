import React from 'react'
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const BotNav = () => {
  return (
    <div className='bg-[#FF9C1A] rounded-tr-[12px] rounded-tl-[15px] px-5 py-2 flex justify-between'>
        <HomeIcon className="text-white" />
        <HistoryIcon className="text-white" />
        <AccountCircleIcon className="text-white" />
    </div>
  )
}

export default BotNav
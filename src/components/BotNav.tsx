import React, { useState } from 'react';
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useSearchContext } from '~context/SearchContext'

const BotNav = () => {
  // const [showProfile, setShowProfile] = useState(false);
  const {setPage} = useSearchContext()

  return (
    <>
      <div className='sticky bottom-0 bg-[#FF9C1A] px-5 py-2 flex justify-between' >
        <HomeIcon className="text-white" onClick={() => setPage('/choose')}/>
        <HistoryIcon className="text-white" onClick={() => setPage('/History')} />
        <AccountCircleIcon className="text-white"onClick={() => setPage('/Profile')}  />
      </div>
    </>
  );
};

export default BotNav;
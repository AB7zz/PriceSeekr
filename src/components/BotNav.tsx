import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import HistoryIcon from '@mui/icons-material/History';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useSearchContext } from '~context/SearchContext';

const BotNav = () => {
  const { page, setPage } = useSearchContext();

  // Define a function to check if the icon is active
  const isIconActive = (iconPage) => {
    return page === iconPage ? 'text-black text-lg' : 'text-white text-base';
  };

  return (
    <div className='fixed w-full bottom-0 bg-[#e0821e] px-5 py-2 flex justify-between'>
      <HomeIcon
        className={isIconActive('/choose')}
        onClick={() => setPage('/choose')}
        style={{ fontSize: '35px' }} // Increase icon size
      />
      <HistoryIcon
        className={isIconActive('/History')}
        onClick={() => setPage('/History')}
        style={{ fontSize: '35px' }} // Increase icon size
      />
      <AccountCircleIcon
        className={isIconActive('/Profile')}
        onClick={() => setPage('/Profile')}
        style={{ fontSize: '35px' }} // Increase icon size
      />
    </div>
  );
};

export default BotNav;

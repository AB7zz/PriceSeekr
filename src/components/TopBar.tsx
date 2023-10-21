import React, { useState } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import logo from 'data-base64:~assets/priceseekrlogo1.png';
import SettingsIcon from '@mui/icons-material/Settings';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';
import PolicyIcon from '@mui/icons-material/Policy';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import CloseIcon from '@mui/icons-material/Close'; // Import the close icon
import { useSearchContext } from '~context/SearchContext';
import { useSignOut } from '~firebase/hooks';

const TopBar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { setPage } = useSearchContext(); // Get setPage function from the context
  const signOut = useSignOut(); 

  const handleCloseWebExtension = () => {
    window.close();
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (action) => {
    // Add your logic for handling menu item clicks here
    console.log(`Clicked on ${action}`);
    handleMenuClose();

    // Check if the action is 'Settings' and set the page to '/Profile'
    if (action === 'Settings') {
      setPage('/Profile');
    }
    else if (action === 'Sign Out') {
      // Call the sign-out function to log the user out
      signOut();
    }
    else if (action === 'Contact Us') {
      // Call the sign-out function to log the user out
      setPage('/Contact')
    }
  };

  return (
    <div className={`bg-black px-1 py-3 mb-6 flex justify-between items-center h-[65px]`}>
      <div className="flex items-center">
        <img className=" mt-2 w-[130px]" src={logo} alt="logo" />

      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '10px' }}>
        <MoreHorizIcon
          className="text-white cursor-pointer"
          onClick={handleMenuOpen}
          fontSize="medium"
        />
        <CloseIcon className="text-white cursor-pointer" onClick={handleCloseWebExtension} fontSize="medium" />
      </div>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'left', // Adjust as needed
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right', // Adjust as needed
        }}
        // Limit the width of the menu
        MenuListProps={{
          style: {
            maxWidth: '200px', // Adjust the maximum width as needed
            padding: '0', // Remove default padding
          },
        }}
        // Disable scroll lock to prevent body overflow hidden
        disableScrollLock={true}
      >
        <MenuItem
          onClick={() => handleMenuItemClick('Settings')}
          style={{ fontSize: '14px', padding: '8px 16px' }} // Customize font size and padding
        >
          <SettingsIcon fontSize="small" style={{ marginRight: '8px' }} /> Settings
        </MenuItem>
        <MenuItem
          onClick={() => handleMenuItemClick('Contact Us')}
          style={{ fontSize: '14px', padding: '8px 16px' }} // Customize font size and padding
        >
          <ContactSupportIcon fontSize="small" style={{ marginRight: '8px' }} /> Contact Us
        </MenuItem>
        <MenuItem
          onClick={() => handleMenuItemClick('Privacy Policy')}
          style={{ fontSize: '14px', padding: '8px 16px' }} // Customize font size and padding
        >
          <PolicyIcon fontSize="small" style={{ marginRight: '8px' }} /> Privacy Policy
        </MenuItem>
        <MenuItem
          onClick={() => handleMenuItemClick('Sign Out')}
          style={{ fontSize: '14px', padding: '8px 16px', color: 'red' }} // Customize font size, padding, and text color
        >
          <ExitToAppIcon fontSize="small" style={{ marginRight: '8px' }} /> Sign Out
        </MenuItem>
      </Menu>
    </div>
  );
};

export default TopBar;

import React, { useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; // Import the ArrowBack icon
import { IconButton } from '@mui/material'; // Import the IconButton component
import amazonImage from 'data-base64:~assets/amazon.png';
import bestbuyImage from 'data-base64:~assets/bestbuy.png';
import ebayImage from 'data-base64:~assets/ebay.png';
import targetImage from 'data-base64:~assets/target.png';
import smallSellerImage from 'data-base64:~assets/smallsellers.png';
import walmartImage from 'data-base64:~assets/walmart.webp';
import { useSearchContext } from '~context/SearchContext';
import { useUpdateDB } from '~firebase/hooks';
import { motion } from 'framer-motion';

const imageUrls = [
  amazonImage,
  bestbuyImage,
  ebayImage,
  targetImage,
  walmartImage,
  smallSellerImage
];

const Profile = () => {
  const { preferences, userEmail, setPage, darkTheme, setDark } = useSearchContext();
  const [isLoading, setIsLoading] = useState(false); // State for loading animation

  // Check if preferences is an array and not null
  const initialPreferences = Array.isArray(preferences)
    ? {
      Amazon: preferences.includes('Amazon'),
      Bestbuy: preferences.includes('Bestbuy'),
      eBay: preferences.includes('eBay'),
      Target: preferences.includes('Target'),
      Walmart: preferences.includes('Walmart'),
      Others: preferences.includes('Others'),
    }
    : {
      Amazon: false,
      Bestbuy: false,
      eBay: false,
      Target: false,
      Walmart: false,
      Others: false,
    };

  const [selectedPreferences, setSelectedPreferences] = useState(initialPreferences);

  const toggleOption = async (optionName) => {
    setIsLoading(true); // Show the loader

    // Simulate a delay of 2-3 seconds
    await new Promise((resolve) => setTimeout(resolve, 2000 + Math.random() * 1000));

    // Your logic for toggling preferences here
    setSelectedPreferences((prevState) => {
      const updatedPreferences = {
        ...prevState,
        [optionName]: !prevState[optionName],
      };
      updateToDB({
        Preferences: Object.keys(updatedPreferences).filter((option) => updatedPreferences[option]),
      });

      // Save the updated preferences to the database whenever a preference is toggled
      // Note: Replace this with your actual update logic
      console.log('Updated preferences:', updatedPreferences);

      return updatedPreferences;
    });

    setIsLoading(false); // Hide the loader
  };
  const updateToDB = useUpdateDB();

  const handleGoBack = () => {
    setPage('/choose');
  };

  return (
    <div>
      <div className="text-left">
        <motion.button
          onClick={handleGoBack}
          className={`rounded-[15px] px-3 py-3 ${darkTheme ? 'bg-[#2d2d2d]' : 'bg-gray-100'} text-[#e0821e]`}
          whileHover={{ scale: 1.1 }}
          style={{
            borderRadius: '20px',
            color: '#FF8500',
            alignItems: 'center',
            alignContent: 'center',
            fontWeight: 500
          }}
        >
          <ArrowBackIcon className='mr-2' />Back
        </motion.button>
      </div>
      <div className="flex items-center justify-center mt-5">
        <div>
          <div className={`text-left mb-2 font-semibold ${darkTheme ? 'text-white' : 'text-black'}`}>Your Email</div>
          <div className={`rounded ${darkTheme ? 'bg-[#2d2d2d]' : 'bg-[#EDEDED] border border-gray-300'} p-2 text-[#8C8C8C]`}>
            {userEmail}
          </div>

          <div className="mt-6 grid grid-cols-2 gap-4">
            <motion.button
              onClick={() => setDark(false)}
              className="rounded-lg bg-[#FFEFDC] text-[#FF9C1A] px-8 py-3 border border-[#FF9C1A] hover:text-[#FF9C1A] hover:bg-[#FFEFDC]"
            >
              Light Theme
            </motion.button>
            <motion.button
              onClick={() => setDark(true)}
              whileHover={{ scale: 1.1 }}
              className="rounded-lg bg-black text-[#FF9C1A] px-8 py-3"
            >
              Dark Theme
            </motion.button>
          </div>

          <div className="mt-8 border-t border-gray-200 pt-4">
            <h2 className={`text-md text-center ${darkTheme ? 'text-white' : 'text-black'}`}>Edit your preferences</h2>

            <div className="grid grid-cols-2 gap-4 mt-5">
              {Object.keys(initialPreferences).map((optionName, index) => (
                <div
                  key={index}
                  className={`rounded-lg w-[100%] h-[60px] px-3 items-center ${darkTheme ? 'bg-[#2d2d2d]' : 'bg-[#EFEFEF]'} flex ${selectedPreferences[optionName]
                      ? 'border-2 border-[#FF9C1A]'
                      : 'border-0 hover:border-2 hover:border-[#FF9C1A]'
                    } cursor-pointer`}
                  onClick={() => toggleOption(optionName)}
                >
                  <img
                    src={imageUrls[index]}
                    alt={`Image ${index}`}
                    className="w-[35px] mr-3"
                    style={{ objectFit: 'contain' }}
                  />
                  <p className={`${darkTheme ? 'text-white' : 'text-[#393939]'} poppins font-semibold text-lg text-center`}>
                    {optionName}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {isLoading && (
            <div className="absolute inset-0 bg-gray-800 bg-opacity-40 flex items-center justify-center">
              <div className="border-t-transparent border-solid animate-spin rounded-full border-blue-400 border-4 h-20 w-20 mx-auto mb-4" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
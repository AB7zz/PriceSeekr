import React, { useState } from 'react';
import amazonImage from 'data-base64:~assets/amazon.png';
import bestbuyImage from 'data-base64:~assets/bestbuy.png';
import craigsImage from 'data-base64:~assets/craigs.png';
import ebayImage from 'data-base64:~assets/ebay.png';
import targetImage from 'data-base64:~assets/target.png';
import { useWriteToDB } from '~firebase/hooks';
import walmartImage from 'data-base64:~assets/walmart.webp';

interface PreferencesProps {
  setIsNewUserToFalse: () => void;
}

const Preferences: React.FC<PreferencesProps> = ({ setIsNewUserToFalse }) => {
  const imageUrls = [
    amazonImage,
    bestbuyImage,
    craigsImage,
    ebayImage,
    targetImage,
    walmartImage
  ];

  const initialPreferences = {
    Amazon: true,
    bestbuy: true,
    craigs: true,
    Ebay: true,
    target: true,
    Walmart: true
  };
  const [preferences, setPreferences] = useState(initialPreferences);

  const toggleOption = (optionName: string) => {
    setPreferences((prevPreferences) => ({
      ...prevPreferences,
      [optionName]: !prevPreferences[optionName]
    }));
  };

  const writeToDB = useWriteToDB()
  const handleContinue = () => {
    const selectedOptions = Object.keys(preferences).filter((option) => preferences[option]);
    writeToDB(selectedOptions);
    
    // Call the callback function to set isNewUser to false in Main
    setIsNewUserToFalse();
  };

  return (
    <div className="px-5 py-10 pt-5 w-[360px] bg-white mt-5">
      <div className="flex flex-col justify-center items-center">
        <p className="text-m mb-4 text-lg poppins font-semibold text-[#707070] text-center">Pick where you love to shop for better deals!</p>
      </div>
      <div className="grid grid-cols-2 gap-4 mt-5">
        {Object.keys(initialPreferences).map((optionName, index) => (
          <div key={index} className={`rounded-lg w-[100%] h-[60px] px-3 items-center bg-[#EFEFEF] flex ${preferences[optionName] ? 'border-2 border-[#FF9C1A]' : 'border-none'} cursor-pointer`} onClick={() => toggleOption(optionName)}>
            <img src={imageUrls[index]} alt={`Image ${index}`} className='w-[35px] mr-3' style={{ objectFit: 'contain' }} />
            <p className='text-[#393939] poppins font-semibold text-lg text-center'>{optionName}</p>
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <button className="bg-[#FF9C1A] text-white poppins font-bold text-base rounded-lg py-2 px-7 transition-colors" onClick={handleContinue}>
          Continue
        </button>
      </div>
      <div className="flex justify-center mt-2">
        <a href="#" className="text-blue-500 poppins font-semibold hover:underline">
          Skip
        </a>
      </div>
    </div>
  );
};

export default Preferences;

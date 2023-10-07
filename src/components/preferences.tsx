import React, { useState } from 'react';
import amazonImage from 'data-base64:~assets/amazon.png';
import bestbuyImage from 'data-base64:~assets/bestbuy.png';
import ebayImage from 'data-base64:~assets/ebay.png';
import targetImage from 'data-base64:~assets/target.png';
import smallSellerImage from 'data-base64:~assets/smallsellers.png';
import walmartImage from 'data-base64:~assets/walmart.webp';
import { useWriteToDB } from '~firebase/hooks';

interface PreferencesProps {
  setIsNewUserToFalse: () => void;
}

const Preferences: React.FC<PreferencesProps> = ({ setIsNewUserToFalse }) => {
  const imageUrls = [
    amazonImage,
    bestbuyImage,
    ebayImage,
    targetImage,
    walmartImage,
    smallSellerImage
  ];

  const initialPreferences = {
    Amazon: true,
    Bestbuy: true,
    Ebay: true,
    Target: true,
    Walmart: true,
    Others: true
  };
  const [preferences, setPreferences] = useState(initialPreferences)

  const toggleOption = (optionName: string) => {
    setPreferences((prevPreferences) => ({
      ...prevPreferences,
      [optionName]: !prevPreferences[optionName]
    }));
  };

  const handleWriteToDB = useWriteToDB()

  const handleContinue = () => {
    const selectedOptions = Object.keys(preferences).filter((option) => preferences[option]);
    handleWriteToDB(selectedOptions);
    setIsNewUserToFalse();
  };

  const handleSkip = () => {
    // Update all preferences to true
    const updatedPreferences = {
      Amazon: true,
      Bestbuy: true,
      Ebay: true,
      Target: true,
      Walmart: true,
      Others: true
    };
  
    // Write updated preferences to the database
    handleWriteToDB(updatedPreferences);
  
    // Continue with the rest of your logic
    setIsNewUserToFalse();
  };
  
  return (
    <div className="px-5 py-10 pt-5 bg-white mt-5">
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
        <a href="#" className="text-blue-500 poppins font-semibold hover:underline" onClick={handleSkip}>
          Skip
        </a>

      </div>
    </div>
  );
};

export default Preferences;

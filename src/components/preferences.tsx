import React, { useState } from 'react';
import amazonImage from 'data-base64:~assets/amazon.png';
import bestbuyImage from 'data-base64:~assets/bestbuy.png';
import craigsImage from 'data-base64:~assets/craigs.png';
import ebayImage from 'data-base64:~assets/ebay.png';
import targetImage from 'data-base64:~assets/target.png';
import { writeToDB } from '~firebase/hooks';
import walmartImage from 'data-base64:~assets/walmart.webp';

const initialPreferences = {
  Amazon: true,
  bestbuy: true,
  craigs: true,
  Ebay: true,
  target:true,
  Walmart: true
};

const Preferences: React.FC = () => {
  const imageUrls = [
    amazonImage,
    bestbuyImage,
    craigsImage,
    ebayImage,
    targetImage,
    walmartImage
  ];

  const [preferences, setPreferences] = useState(initialPreferences);

  const toggleOption = (optionName) => {
    setPreferences((prevPreferences) => ({
      ...prevPreferences,
      [optionName]: !prevPreferences[optionName]
    }));
  };

  const handleContinue = () => {
    const selectedOptions = Object.keys(preferences).filter((option) => preferences[option]);
    writeToDB(selectedOptions);
  };

  return (
    <div className="px-5 py-10 pt-5 w-[360px] bg-white">
      <div className="flex flex-col justify-center items-center">
        <p className="text-m mb-4">Pick where you love to shop for better deals!</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {Object.keys(initialPreferences).map((optionName, index) => (
          <div key={index}         className={`rounded-lg w-100 h-20 ${preferences[optionName] ? 'border-2 border-[#FF9C1A]' : 'border border-[#EFEFEF]'} cursor-pointer`} onClick={() => toggleOption(optionName)}>
            <img src={imageUrls[index]} alt={`Image ${index}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <button className="bg-[#FF9C1A] text-white text-base rounded-lg py-2 px-4 transition-colors" onClick={handleContinue}>
          Continue
        </button>
      </div>
      <div className="flex justify-center mt-2">
        <a href="#" className="text-blue-500 hover:underline">
          Skip
        </a>
      </div>
    </div>
  );
};

export default Preferences;

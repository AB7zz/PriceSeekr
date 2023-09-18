import React, { useState, useEffect } from 'react';
import amazonImage from 'data-base64:~assets/amazon.png';
import bestbuyImage from 'data-base64:~assets/bestbuy.png';
import ebayImage from 'data-base64:~assets/ebay.png';
import targetImage from 'data-base64:~assets/target.png';
import smallSellerImage from 'data-base64:~assets/smallsellers.png';
import walmartImage from 'data-base64:~assets/walmart.webp';
import { useReadDB } from '~firebase/hooks';
import { useSearchContext } from '~context/SearchContext';
import { useUpdateDB } from '~firebase/hooks'; 

const imageUrls = [
  amazonImage,
  bestbuyImage,
  ebayImage,
  targetImage,
  walmartImage,
  smallSellerImage
];

const Profile = () => {
  const { preferences, setPreferences, userEmail } = useSearchContext();

  const initialPreferences = {
    Amazon: preferences.includes('Amazon'),
    Bestbuy: preferences.includes('Bestbuy'),
    eBay: preferences.includes('eBay'),
    Target: preferences.includes('Target'),
    Walmart: preferences.includes('Walmart'),
    Others: preferences.includes('Others')
  };

  const [selectedPreferences, setSelectedPreferences] = useState(initialPreferences);

  const toggleOption = (optionName) => {

    setSelectedPreferences((prevState) => ({
      ...prevState,
      [optionName]: !prevState[optionName]
    }));
  };


  const savePreferences = () => {
   
    const updatedPreferences = Object.keys(selectedPreferences).filter(
      (optionName) => selectedPreferences[optionName]
    );

    updateToDB({
      Preferences: updatedPreferences,
    });
  };

  const updateToDB = useUpdateDB();

  return (
    <div className="mt-5 px-2 py-5 max-w-[340px] mx-auto">
        <div className="text-left mb-2 font-semibold">Your Email</div>
        <div className="rounded bg-[#EDEDED] p-2 border border-gray-300 text-[#8C8C8C]">
        {userEmail}
        </div>

    <div className="mt-6 grid grid-cols-2 gap-4">
      <button className="rounded-lg bg-[#FFEFDC] text-[#FF9C1A] px-8 py-3 border border-[#FF9C1A] hover:text-[#FF9C1A] hover:bg-[#FFEFDC]">
        Light Theme
      </button>
      <button className="rounded-lg bg-black text-[#FF9C1A] px-8 py-3">Dark Theme</button>
    </div>

      <div className="mt-8 border-t border-gray-200 pt-4">
        <h2 className="text-md text-center">Edit your preferences</h2>

        <div className="grid grid-cols-2 gap-4 mt-5">
          {Object.keys(initialPreferences).map((optionName, index) => (
            <div
              key={index}
              className={`rounded-lg w-[100%] h-[60px] px-3 items-center bg-[#EFEFEF] flex ${
                selectedPreferences[optionName]
                  ? 'border-2 border-[#FF9C1A]'
                  : 'border-none'
              } cursor-pointer`}
              onClick={() => toggleOption(optionName)}
            >
              <img
                src={imageUrls[index]}
                alt={`Image ${index}`}
                className="w-[35px] mr-3"
                style={{ objectFit: 'contain' }}
              />
              <p className="text-[#393939] poppins font-semibold text-lg text-center">
                {optionName}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 text-center">
      <button
  className="rounded bg-blue-500 text-white px-8 py-2 border"

          onClick={savePreferences}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default Profile;

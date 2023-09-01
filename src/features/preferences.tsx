import React from 'react';
import amazonImage from 'data-base64:~assets/amazon.png';
import bestbuyImage from 'data-base64:~assets/bestbuy.png';
import craigsImage from 'data-base64:~assets/craigs.png';
import ebayImage from 'data-base64:~assets/ebay.png';
import targetImage from 'data-base64:~assets/target.png';
import walmartImage from 'data-base64:~assets/walmart.webp';

const Preferences: React.FC = () => {
  // Sample image URLs, you should replace these with your image URLs
  const imageUrls = [
    amazonImage,
    bestbuyImage,
    craigsImage,
    ebayImage,
    targetImage,
    walmartImage
  ];

  const handleContinue = () => {
    // Add your logic for continuing here
  };

  return (
    <div className="px-5 py-10 pt-5 w-[360px] bg-white">
      <div className="flex flex-col justify-center items-center">
        <p className="text-m mb-4">Pick where you love to shop for better deals!</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {imageUrls.map((imageUrl, index) => (
          <div key={index} className="bg-[#EFEFEF] rounded-lg w-100 h-20">
            <img src={imageUrl} alt={`Image ${index}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
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

import React from 'react';

import amazonImage from 'data-base64:~assets/amazon.png';
import bestbuyImage from 'data-base64:~assets/bestbuy.png';
import targetImage from 'data-base64:~assets/target.png';
import walmartImage from 'data-base64:~assets/walmart.webp';
import Space from 'data-base64:~assets/space.png';

const NotSupport: React.FC = () => {
  const platforms = [
    { image: amazonImage, alt: 'Amazon', url: 'https://www.amazon.com' },
    { image: walmartImage, alt: 'Walmart', url: 'https://www.walmart.com' },
    { image: bestbuyImage, alt: 'BestBuy', url: 'https://www.bestbuy.com' },
    { image: targetImage, alt: 'Target', url: 'https://www.target.com' },
  ];

  return (
    <div className="flex flex-col">
      <div className="w-full h-40 bg-black rounded-lg text-center relative">
        <div className="absolute left-3 top-9">
          <img
            src={Space} // Use the imported Space (astronaut) image
            alt="Astronaut"
            className="rounded-full w-20"
          />
        </div>
        <div className="absolute right-5 top-0 text-white text-center flex items-center justify-center h-full">
          <p className="text-sm">We do not support this website</p>
        </div>
      </div>
      <div className="text-center mt-3">
        <p className="my-4 text-base">
          Browse products from one of our supported platforms
        </p>
        <div className="grid grid-cols-2 gap-4">
          {platforms.map((item, index) => (
            <a key={index} href={item.url} target="_blank" rel="noopener noreferrer">
              <div className="shadow-lg flex items-center justify-center h-32 w-30 px-3 py-3 rounded-[15px] bg-gray-100">
                <img src={item.image} alt={item.alt} className="max-w-20 max-h-20" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotSupport;

import React from 'react';
import amazonImage from 'data-base64:~assets/amazon.png';
import bestbuyImage from 'data-base64:~assets/bestbuy.png';
import targetImage from 'data-base64:~assets/target.png';
import walmartImage from 'data-base64:~assets/walmart.webp';
import Space from 'data-base64:~assets/space.png';
import StarField from 'data-base64:~assets/starfield.png';

const NotSupport: React.FC = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full h-[14rem] bg-black rounded-lg text-center">
        <div
          className="absolute top-0 left-0 right-0 bottom-0 bg-cover rounded-lg"
          style={{ backgroundImage: `url(${StarField})` }}
        ></div>
        <div
          className="absolute top-3 left-1/2 transform -translate-x-1/2"
        >
          <img
            src={Space}
            alt="Astronaut"
            className="rounded-full h-[150px]"
          />
        </div>

        <div className="absolute bottom-7 left-0 right-0 text-white text-center flex items-center justify-center">
          <p className="text-lg">We do not support this website</p>
        </div>
      </div>
      <div className="text-center my-8">
        <p className="text-sm text-gray-500">
          Browse products from one of our supported platforms
        </p>
        <div className="grid grid-cols-2 gap-2 mt-4 mb-20">
          <a href="https://www.amazon.com" target="_blank" rel="noopener noreferrer">
            <div className="flex items-center justify-center h-[140px] rounded-md bg-gray-100">
              <img src={amazonImage} alt="Amazon" className="w-[100px]" />
            </div>
          </a>
          <a href="https://www.walmart.com" target="_blank" rel="noopener noreferrer">
            <div className="flex items-center justify-center h-[140px] rounded-md bg-gray-100">
              <img src={walmartImage} alt="Walmart" className="w-[175px]" />
            </div>
          </a>
          <a href="https://www.bestbuy.com" target="_blank" rel="noopener noreferrer">
            <div className="flex items-center justify-center h-[140px] rounded-md bg-gray-100">
              <img src={bestbuyImage} alt="BestBuy" className="w-[120px]" />
            </div>
          </a>
          <a href="https://www.target.com" target="_blank" rel="noopener noreferrer">
            <div className="flex items-center justify-center h-[140px] rounded-md bg-gray-100">
              <img src={targetImage} alt="Target" className="w-[190px]" />
            </div>
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotSupport;

import React from 'react';
import amazonImage from 'data-base64:~assets/amazon.png';
import bestbuyImage from 'data-base64:~assets/bestbuy.png';
import targetImage from 'data-base64:~assets/target.png';
import walmartImage from 'data-base64:~assets/walmart.webp';
import bigImage from 'data-base64:~assets/BigImage.png';

const NotSupport: React.FC = () => {
    return (
      <div className="h-screen flex flex-col justify-center items-center">
        <div>
          <img
            src={bigImage} // Use the imported bigImage variable
            alt="Big Image"
            style={{ width: '100%', height: 'auto' }} // Set width to 100% to take up space
          />
        </div>
        <div className="w-full text-center">
          <p className="text-lg my-4">
            Browse products from one of our supported platforms
          </p>
          <div className="flex flex-wrap justify-center">
            <div className="m-4">
              <img
                src={amazonImage} // Use the imported amazonImage variable
                alt="Amazon"
                className="w-32 h-32"
              />
            </div>
            <div className="m-4">
              <img
                src={walmartImage} // Use the imported walmartImage variable
                alt="Walmart"
                className="w-32 h-32"
              />
            </div>
            <div className="m-4">
              <img
                src={bestbuyImage} // Use the imported bestbuyImage variable
                alt="BestBuy"
                className="w-32 h-32"
              />
            </div>
            <div className="m-4">
              <img
                src={targetImage} // Use the imported targetImage variable
                alt="Target"
                className="w-32 h-32"
              />
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default NotSupport;
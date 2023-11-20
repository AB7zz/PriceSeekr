import React, { useState, useEffect } from 'react';
import { useSearchContext } from '~context/SearchContext';


const Loader = () => {
  const {darkTheme} = useStateContext()
  const [loadingText, setLoadingText] = useState('Searching for products');

  useEffect(() => {
    const textArray = [
      'Searching for matches',
      'Filtering the results',
      'Compiling the results',
    ];
    let currentIndex = 0;

    const intervalId = setInterval(() => {
      currentIndex = (currentIndex + 1) % textArray.length;
      if (currentIndex === textArray.length - 1) {
        clearInterval(intervalId); // Stop interval at last index
      }
      setLoadingText(textArray[currentIndex]);
    }, 2000); 


  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
        <div className="border-t-transparent border-solid animate-spin rounded-full border-blue-400 border-4 h-20 w-20 mx-auto mb-4"></div>
            <p className={` text-center ${darkTheme ? 'text-white' : 'text-gray-600'} text-lg transition-opacity duration-500 ease-in-out`}>
                {loadingText}
            </p>
        </div>
    </div>
  );
};

export default Loader;

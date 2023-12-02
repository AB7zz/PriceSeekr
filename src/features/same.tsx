import React, { useEffect, useState } from 'react';
import { useSearchContext } from '~context/SearchContext';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 
import Loader from '../components/loader';
import NoResults from '~components/NoResults';
import NotSupport from '../components/NotSupport';
import { useSaveSearchResultToFirestore } from '~firebase/hooks';
import ApiExceeded from '~components/ApiExceeded'


const Same = ({ data }) => {
  const { runSearchImage, same, setPage, darkTheme, apiCalls } = useSearchContext();
  const [isLoading, setIsLoading] = useState(true);
  const saveSearchResultToFirestore = useSaveSearchResultToFirestore();
  useEffect(() => {
    const fetchData = async () => {
      if (!same && data !== null) {
        runSearchImage(data);
      } else {
        setIsLoading(false);
      }

      // Save search result to Firestore if data is available
      if (same && same.length > 0) {
        console.log("same data tmp: ",same )
        saveSearchResultToFirestore(same, data, true, apiCalls);
      }
    };

    fetchData();
  }, [data, same]);

  // Function to remove asterisk from price
  const removeAsterisk = (price) => {
    return price.replace('*', '');
  };

  const handleGoBack = () => {
    setPage('/choose');
  };

  // Function to truncate title text by character length
  const truncateTitle = (title, maxLength) => {
    if (title.length + 3 > maxLength) {
      return title.slice(0, maxLength) + '...';
    }
    return title;
  };
 
  return (
    <div className="">
      {isLoading && apiCalls < 5 ? (
        <Loader />
      ) 
      : isLoading && apiCalls >= 5 ? (
        <ApiExceeded />
      )
      : same && same.length > 0 ? (
        <>
        <div className='px-5 py-5 bg-transparent pb-20' >
          {/* back button */}
          <div className="text-left mb-3" >
            <button
              onClick={handleGoBack}
              className={`rounded-[15px] px-3 py-3 ${darkTheme ? 'bg-[#2d2d2d]' : 'bg-gray-100'} text-[#e0821e]`}
              style={{
                  borderRadius: '20px',
                  color: '#FF8500',
                  alignItems: 'center',
                  alignContent: 'center',
                  fontWeight: 500
              }}
            >
                <ArrowBackIcon className='mr-2' />Back
            </button>
          </div>
          <div>
            <div className="grid grid-cols-2 gap-4">
              {same.map((product, i) => (
                <div onClick={() => chrome.tabs.create({ url: product.link }) } className={`h-[270px] rounded-[10px] shadow-md px-2 py-2 ${darkTheme ? 'bg-[#2d2d2d]' : 'bg-gray-100'} flex flex-col justify-between relative`} key={i}>
                  {product.isOutOfStock && (
                    <p className="absolute bottom-2 left-2 text-blue-800 font-bold text-xs">In Stock</p>
                  )}
                  <div>
                    <img className="w-[200px] h-[139px]" src={product.thumbnail} alt="product thumbnail" />
                    <a className={`${darkTheme && 'text-white'} text-sm mt-1`}>
                      {truncateTitle(product.title, 48)} {/* Limit title to 50 characters */}
                    </a>
                    <p className={`${darkTheme ? 'text-white' : 'text-gray-500'} text-sm absolute bottom-6 left-2`}>{product.source}</p>
                  </div>
                  {product.price && (
                    <p className="text-green-400 text-sm font-bold self-end">
                      {removeAsterisk(product.price.value)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
          </div>
        </>
      ) : (
        <NoResults />
      )}
    </div>
  );
};

export default Same;

import React, { useEffect, useState } from 'react';
import { useSearchContext } from '~context/SearchContext';
import Loader from '../components/loader';
import NotSupport from '../components/NotSupport';
import ArrowBackIcon from '@mui/icons-material/ArrowBack'; 
import { useSaveSearchResultToFirestore } from '~firebase/hooks';
import NoResults from '~components/NoResults';
import {motion} from 'framer-motion'

const Similiar = ({ data }) => {
  const { runSearchSimiliar, similiar, setPage, darkTheme } = useSearchContext();
  const [isLoading, setIsLoading] = useState(true);
  const [notfound, setNotfound] = useState(false);
  const saveSearchResultToFirestore = useSaveSearchResultToFirestore();
  useEffect(() => {
    const fetchData = async () => {
      if (!similiar && data !== null) {
        runSearchSimiliar(data);
      } else if (JSON.stringify(similiar) === JSON.stringify(["Not found"])) {
        setIsLoading(false);
        setNotfound(true);
      } else {
        setIsLoading(false);
      }
      console.log("similar data tmp: ", similiar);
      // Save search results to Firestore if data is available
      if (similiar && similiar.length > 0) {
        
        saveSearchResultToFirestore(similiar, data, false);
      }
    };

    fetchData();
  }, [data, similiar]);

  // Function to remove asterisk from price
  const removeAsterisk = (price) => {
    return price.replace('*', '');
  };

  const handleGoBack = () => {
    setPage('/choose');
  };

  // Function to truncate title text by character length
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength);
    }
    return text;
  };
 
  return (
    <div className={`px-5 py-5 ${darkTheme ? 'bg-transparent' : 'bg-white'} rounded-[15px] pb-20`}>
      {isLoading ? (
        <Loader />
      ) : similiar && similiar.length > 0 ? (
        <>
          {/* back button */}
          <div className="text-left mb-3" >
            <motion.button
              onClick={handleGoBack}
              className={`rounded-[15px] px-3 py-3 ${darkTheme ? 'bg-[#2d2d2d]' : 'bg-gray-100'} text-[#e0821e]`}
              whileHover={{ scale: 1.05 }}
              style={{
                  borderRadius: '20px',
                  color: '#FF8500',
                  alignItems: 'center',
                  alignContent: 'center',
                  fontWeight: 500
              }}
          >
              <ArrowBackIcon className='mr-2' />Back
          </motion.button>
          </div>
          <div>
            <div className="grid grid-cols-2 gap-4">
              {similiar.map((product, i) => (
                <div onClick={() => chrome.tabs.create({ url: product.link }) } className={`h-[270px] rounded-[10px] shadow-md px-2 py-2 ${darkTheme ? 'bg-[#2d2d2d]' : 'bg-gray-100'} flex flex-col justify-between relative`} key={i}>
                  <p className="absolute bottom-2 left-2 text-dark-green font-bold text-xs">In Stock</p>
                  <div>
                    <img className="w-[200px] h-[139px]" src={product.thumbnail} alt="product thumbnail" />
                    <a className={`${darkTheme && 'text-white'} text-sm mt-1`}>
                      {truncateText(product.title, 48)} {/* Limit title to 48 characters */}
                    </a>
                    <p className={`${darkTheme ? 'text-white' : 'text-gray-500'} text-sm absolute bottom-6 left-2`}>
                      {truncateText(product.source, 10)} {/* Limit source to 8 characters */}
                    </p>
                  </div>
                  {product.price && (
                    <p className="text-green-400 text-sm font-bold self-end">
                      {removeAsterisk(product.price)}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <NoResults />
      )}
    </div>
  );
};

export default Similiar;

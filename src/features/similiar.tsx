import React, { useEffect, useState } from 'react';
import { useSearchContext } from '~context/SearchContext';
import Loader from '../components/loader';
import NotSupport from '../components/NotSupport';
import { saveSearchResultToFirestore } from '~firebase/hooks';

const Similiar = ({ data }) => {
  const { runSearchSimiliar, similiar } = useSearchContext();
  const [isLoading, setIsLoading] = useState(true);
  const [notfound, setNotfound] = useState(false);

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

      // Save search results to Firestore if data is available
      if (similiar && similiar.length > 0) {
        console.log("similar data tmp: ",similiar )
        saveSearchResultToFirestore(similiar, data, false);
      }
    };

    fetchData();
  }, [data, similiar]);

  // Function to remove asterisk from price
  const removeAsterisk = (price) => {
    return price.replace('*', '');
  };

  // Function to truncate title text by character length
  const truncateText = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.slice(0, maxLength);
    }
    return text;
  };

  return (
    <div className="px-5 py-5 bg-white">
      <>
      <div>
        <div className="grid grid-cols-2 gap-4">
          {isLoading ? (
            <Loader />
          ) : similiar && !notfound ? (
            similiar.map((product, i) => (
              <a href={product.link} className="h-[270px] shadow-md px-2 py-2 bg-gray-100 flex flex-col justify-between relative" key={i}>
              <p className="absolute bottom-2 left-2 text-dark-green font-bold text-xs">In Stock</p>
              <div>
                <img className="w-[200px] h-[139px]" src={product.thumbnail} alt="product thumbnail" />
                <a className="text-sm mt-1">
                  {truncateText(product.title, 48)} {/* Limit title to 48 characters */}
                </a>
                <p className="text-gray-500 text-sm absolute bottom-6 left-2 ">
                  {truncateText(product.source, 10)} {/* Limit source to 8 characters */}
                </p>
              </div>
              {product.price && (
                <p className="text-green-400 text-sm font-bold self-end">
                  {removeAsterisk(product.price)}
                </p>
              )}
            </a>
            ))
          ) : (
            !isLoading && <p>No similar products found.</p>
          )}
        </div>
      </div>
      </>
    </div>
  );
};

export default Similiar;

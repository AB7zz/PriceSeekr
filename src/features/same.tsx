import React, { useEffect, useState } from 'react';
import { useSearchContext } from '~context/SearchContext';
import Loader from '../components/loader';
import NotSupport from '../components/NotSupport';
import { saveSearchResultToFirestore } from '~firebase/hooks';

const Same = ({ data }) => {
  const { runSearchImage, same } = useSearchContext();
  const [isLoading, setIsLoading] = useState(true);
  const [notfound, setNotfound] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!same && data !== null) {
        runSearchImage(data);
      } else if (JSON.stringify(same) === JSON.stringify(["Not found"])) {
        setIsLoading(false);
        setNotfound(true);
      } else {
        setIsLoading(false);
      }

      // Save search result to Firestore if data is available
      if (same && same.length > 0) {
        console.log("same data tmp: ",same )
        saveSearchResultToFirestore(same, data, true);
      }
    };

    fetchData();
  }, [data, same]);

  // Function to remove asterisk from price
  const removeAsterisk = (price) => {
    return price.replace('*', '');
  };

  // Function to truncate title text by character length
  const truncateTitle = (title, maxLength) => {
    if (title.length + 3 > maxLength) {
      return title.slice(0, maxLength) + '...';
    }
    return title;
  };

  return (
    <div className="px-5 py-5 w-[360px] bg-white">
        <>
          <div>
            <div className="grid grid-cols-2 gap-4">
              {isLoading ? (
                <Loader />
              ) : same && !notfound ? (
                same.map((product, i) => (
                  <a href={product.link} className="h-[270px] shadow-md px-2 py-2 bg-gray-100 flex flex-col justify-between relative" key={i}>
                    {product.isOutOfStock && (
                      <p className="absolute bottom-2 left-2 text-dark-green font-bold text-xs">In Stock</p>
                    )}
                    <div>
                      <img className="w-[200px] h-[139px]" src={product.thumbnail} alt="product thumbnail" />
                      <a className="text-sm mt-1">
                        {truncateTitle(product.title, 48)} {/* Limit title to 50 characters */}
                      </a>
                      <p className="text-gray-500 text-sm absolute bottom-6 left-2">{product.source}</p>
                    </div>
                    {product.price && (
                      <p className="text-green-400 text-sm font-bold self-end">
                        {removeAsterisk(product.price.value)}
                      </p>
                    )}
                  </a>
                ))
              ) : (
                !isLoading && <p>No cheaper products found.</p>
              )}
            </div>
          </div>
        </>
    </div>
  );
};

export default Same;

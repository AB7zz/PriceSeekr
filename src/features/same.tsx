import React, { useEffect, useState } from 'react';
import { useSearchContext } from '~context/SearchContext';
import Loader from '../components/loader';
import NotSupport from '../components/NotSupport';
import { saveSearchResultToFirestore } from '~firebase/hooks';
const Same = ({ data }) => {
  const { runSearchImage, same } = useSearchContext();
  const [isLoading, setIsLoading] = useState(true);
  const [notfound, setnotfound] = useState(false);


  
  React.useEffect(() => {
    const fetchData = async () => {
      if (!same && data !== "none") {
        runSearchImage(data);
      } else if (JSON.stringify(same) === JSON.stringify(["Not found"])) {
        setIsLoading(false);
        setnotfound(true);
      } else {
        setIsLoading(false);
      }
    
      // Save search result to Firestore if data is available
      if (same && same.length > 0) {
        const searchResult = same[0]; // Assuming you want to save the first result
        saveSearchResultToFirestore(searchResult, data);
      }
    };

    fetchData();
  }, [data, same]);

  return (
    <div className="px-5 py-5 w-[360px] bg-white">
      {data == "none" ? 
      <div>
        <NotSupport/>
      </div> 
      : 
      <>
        <div>
          <div className="grid grid-cols-2 gap-4">
            {isLoading ? (
              <Loader />
            ) : same && !notfound ? (
              same.map((product, i) => (
                
                <div className="shadow-lg px-3 py-3 rounded-[15px] bg-gray-100" key={i}>
                  <img className="w-[200px]" src={product.thumbnail} alt="product thumbnail" />
                  <a href={product.link} className="text-lg">
                    {product.title}
                  </a>
                  {product.price && (
                    <p className="text-blue-500 text-lg font-bold">{product.price.value}</p>
                  )}
                </div>
              ))
            ) : (
              !isLoading && <p>No cheaper products found.</p>
            )}
          </div>
        </div>
      </>
      }
    </div>
  );
};

export default Same;

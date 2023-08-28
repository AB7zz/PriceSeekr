import React, { useEffect, useState } from 'react';
import { useSearchContext } from '~context/SearchContext';
import Loader from './loader';

const Same = ({ data }) => {
  const { runSearchImage, same } = useSearchContext();
  const [isLoading, setIsLoading] = useState(true);
  const [notfound, setnotfound] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!same) {
        runSearchImage(data);
      }else if(JSON.stringify(same) === JSON.stringify(["Not found"])){
        console.log("worked")
        setIsLoading(false);
        setnotfound(true);
      }else{
        setIsLoading(false);
      }
    };

    fetchData();
  }, [data, same]);

  return (
    <div className="px-5 py-5 w-[500px] bg-white">
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
            !isLoading && <p>This is the best seller we found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Same;

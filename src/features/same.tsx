import React, { useEffect, useState } from 'react';
import { useSearchContext } from '~context/SearchContext';
import Loader from './loader';

const Same = ({ data }) => {
  const { runSearchImage, same } = useSearchContext();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!same) {
      runSearchImage(data);
    } else {
      setIsLoading(false);
    }
  }, [data, same]);
  

  return (
    <div className="px-5 py-5 w-[500px] bg-white">
      {/* <div>
        <h1 className="text-xl font-bold my-3">Your product</h1>
        {data && (
          <div className="shadow-lg px-3 py-3 rounded-[15px] bg-white">
            <img className="w-[200px]" src={data[1]} alt="" />
            <h3 className="text-lg">{data[0]}</h3>
            <p className="text-blue-500 text-lg font-bold">{data[2]}</p>
          </div>
        )}
      </div> */}
      <div>
        {/* <h1 className="text-xl font-bold my-3">Same products</h1> */}
        <div className="grid grid-cols-2 gap-4">
          {isLoading ? (
            <Loader />
            ) : (
            same &&
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Same;

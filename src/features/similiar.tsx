import React, { useEffect, useState } from 'react';
import { useSearchContext } from '~context/SearchContext'
import Loader from './loader';
const Similiar = ({data}) => {
  const {runSearchSimiliar, similiar} = useSearchContext()
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {

    if(!similiar && data!="none"){
      runSearchSimiliar(data)
    } else {
      setIsLoading(false);
    }
  }, [data, similiar]);

  return (
    <div className="px-5 py-5 w-[360px] bg-white">
      {data == "none" ? 
      <div>
        <p className='text-center font-semibold text-lg'>Sorry! We don't support this website yet</p>
      </div> 
      : 
      <>
          <div>
            <div className="grid grid-cols-2 gap-4">
              {isLoading ? (
                <Loader />
                ) : (similiar && 
                similiar.map((product, i) => (
                  <div key={i} className='shadow-lg px-3 py-3 rounded-[15px] bg-gray-100'>
                    <img className='w-[200px]' src={product.thumbnail} alt="product thumbnail" />
                    <a href={product.link} className="text-lg">{product.title}</a>
                    <p className="text-blue-500 text-lg font-bold">{product.price}</p>
                  </div>
                ))
              )}
          </div>
        </div>
      </>}
      </div>
    )
}

export default Similiar
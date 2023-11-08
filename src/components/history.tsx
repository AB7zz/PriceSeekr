import React, { useEffect, useState } from 'react';
import { useSearchContext } from '~context/SearchContext';
import { readHistoryDB } from '~firebase/hooks';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { motion } from 'framer-motion'

const DisplayHistory = () => {
  const { user, history, setPage } = useSearchContext();
  const [pageDetails, setPageDetails] = useState([]);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const readHistory = readHistoryDB();

  useEffect(() => {
    const fetchHistoryData = async () => {
      if (user) {
        await readHistory(user.uid);
        const extractedPageDetails = history.PageData.map((pageData) => pageData.PageDetails);
        setPageDetails(extractedPageDetails);
      }
    };

    fetchHistoryData();
  }, [history]);

  const handleItemClick = (index) => {
    setSelectedItemIndex(index);
  };

  const handleGoBack = () => {
    if (selectedItemIndex !== null) {
      setPage('/History');
      setSelectedItemIndex(null);
    } else {
      setPage('/choose');
    }
  };

  const limitTitle = (title, wordLimit) => {
    const words = title.split(' ');
    if (words.length <= wordLimit) {
      return title;
    } else {
      return words.slice(0, wordLimit).join(' ') + '...';
    }
  };

  const renderContent = () => {
    if (selectedItemIndex !== null) {
      const selectedItem = history.PageData[selectedItemIndex].SearchRes;
      return (
        <div>
        <p className="text-center text-md text-black font-semibold">
          Showing results for{' '}
          <a
              href={history.PageData[selectedItemIndex].PageDetails[4]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-500 hover:underline text-xs"
              >
            {limitTitle(history.PageData[selectedItemIndex].PageDetails[0], 12)}
          </a>
        </p>
          <table className="w-full mt-4 bg-white shadow-md rounded-lg overflow-hidden border">
            <thead className="">

              <tr>
                <th className=" border-bottom"></th>
                <th className=" border-bottom"></th>
                <th className="border-bottom"></th>
                <th className="border-bottom"></th>
              </tr>
            </thead>
            <tbody>
              {selectedItem.map((item, index) => (
                <tr key={index} className="hover:bg-gray-100 transition duration-300 cursor-pointer border">
                  <td className="px-2 py-5  mx-auto flex justify-center items-center">
                    <img src={item.thumbnail} alt={`Item ${index + 1}`} className="max-h-[100px] max-w-[90px] min-h-[50px] min-w-[50px]"/>
                  </td>
                  <td className="px-2 py-2 border text-xs">
                    <a
                      href={item.url}
                    
                      className="text-indigo-500 hover:underline text-xs"
                    >
                      {limitTitle(item.title, 12)}
                    </a>
                  </td>
                  <td className="px-2 py-4 border text-xs">{limitTitle(item.company,2)}</td>
                  <td className="px-1 py-0 border text-xs">${item.price.toFixed(2)}</td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else if (pageDetails) {
      return (
        <div>
        <p className="text-center text-lg text-black font">
          Your Past Searches
        </p>
        <table className="w-full mt-4 bg-white shadow-md rounded-lg overflow-hidden border">
            <thead className="">
              <tr>
                <th className="border-bottom"></th>
                <th className="border-bottom"></th>
                <th className="border-bottom"></th>
                <th className="border-bottom"></th>
              </tr>
            </thead>
          <tbody>
            {pageDetails.map((item, index) => (
              <tr
                key={index}
                className="hover:bg-gray-100 transition duration-300 cursor-pointer border"
                onClick={() => handleItemClick(index)}
              >
                
                <td className="px-2 py-5 mx-auto flex justify-center items-center">
                  <img
                    src={item[1]}
                    alt={`Event ${index + 1}`}
                    className="max-h-[100px] max-w-[90px] min-h-[50px] min-w-[50px]"
                  />
                </td>

                <td className="px-2 py-2 border text-xs">
                  <a
                    href={item[4]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-500 hover:underline text-xs"
                  >
                    {limitTitle(item[0], 12)}
                  </a>
                </td>
                <td className="px-2 py-4 border text-xs">{item[3]}</td>
                <td className="px-1 py-0 border text-xs">${parseFloat(item[2].replace(/[^\d.]/g, '')).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      );
    } else {
      return (
        <div>
          <h1 className="text-center text-xl text-black font-semibold">Nothing to display</h1>
        </div>
      );
    }
  };

  return (
    <div className="mt-5 pb-20">
      <div className="w-full max-w-3xl">
        <div className="text-left mb-2">
          <motion.button
            onClick={handleGoBack}
            className="rounded-[15px] px-3 py-3 bg-gray-100 text-[#FF8500]"
            whileHover={{scale: 1.1}}
            style={{
              borderRadius: '20px',
              color: '#FF8500',
              alignItems: 'center',
              alignContent: 'center',
              fontWeight: 500
            }}
          >
            <ArrowBackIcon fontSize="xsmall" className='mr-2' />Back
          </motion.button>
        </div>
        {renderContent()}
      </div>
    </div>
  );
};

export default DisplayHistory;

import React, { useEffect, useState } from 'react';
import { useSearchContext } from '~context/SearchContext';
import { readHistoryDB } from '~firebase/hooks';

const DisplayHistory = () => {
  const { user, history } = useSearchContext();
  const [pageDetails, setPageDetails] = useState([]);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null); // Track the selected item
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
}, [history]); // Empty dependency array

  // Handle item click to set the selected item index
  const handleItemClick = (index) => {
    setSelectedItemIndex(index);
  };

  // Render the details of the selected item or the table of items
  const renderContent = () => {
    if (selectedItemIndex !== null) {
      // Display details of the selected item
      const selectedItem = history.PageData[selectedItemIndex].SearchRes;
      return (
        <div>
          <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
            <thead className="bg-gray-500 text-white">
              <tr>
                <th className="px-4 py-2">Image</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Price</th> {/* Add Price column */}
              </tr>
            </thead>
            <tbody>
              {selectedItem.map((item, index) => (
                <tr key={index} className="hover:bg-gray-100 transition duration-300">
                  <td className="px-4 py-2">
                    <img src={item.thumbnail} alt={`Item ${index + 1}`} className="h-10 w-10 rounded-full" />
                  </td>
                  <td className="px-4 py-2">
                    <a
                      href={item.url} // Use item.url for linking
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-500 hover:underline"
                    >
                      {item.title}
                    </a>
                  </td>
                  <td className="px-4 py-2">{item.price}</td> {/* Display Price */}
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => setSelectedItemIndex(null)}>Back to History</button>
        </div>
      );
    } else {
      // Display the table of items
      return (
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-500 text-white">
            <tr>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Title</th>
              <th className="px-4 py-2">Price</th>
            </tr>
          </thead>
          <tbody>
            {pageDetails.map((item, index) => (
              <tr
                key={index}
                className="hover:bg-gray-100 transition duration-300"
                onClick={() => handleItemClick(index)} // Handle item click
              >
                <td className="px-4 py-2">
                  <img src={item[1]} alt={`Event ${index + 1}`} className="h-10 w-10 rounded-full" />
                </td>
                <td className="px-4 py-2">
                  <a
                    href={item[0]}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-500 hover:underline"
                  >
                    {item[0]}
                  </a>
                </td>
                <td className="px-4 py-2">{item[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
  };

  return (
    <div className="mt-5 py-5 mx-auto">
      <div className="w-full max-w-3xl">
        {renderContent()} {/* Render the selected item details or the table */}
      </div>
    </div>
  );
};

export default DisplayHistory;
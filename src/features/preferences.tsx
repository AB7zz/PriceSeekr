import React from 'react';
import { database } from '~firebase';
import { ref, set } from 'firebase/database';
import amazonImage from 'data-base64:~assets/amazon.png';
import bestbuyImage from 'data-base64:~assets/bestbuy.png';
import craigsImage from 'data-base64:~assets/craigs.png';
import ebayImage from 'data-base64:~assets/ebay.png';
import targetImage from 'data-base64:~assets/target.png';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import walmartImage from 'data-base64:~assets/walmart.webp';

const Preferences: React.FC = () => {
  // Sample image URLs, you should replace these with your image URLs
  const imageUrls = [
    amazonImage,
    bestbuyImage,
    craigsImage,
    ebayImage,
    targetImage,
    walmartImage
  ];

  const handleContinue = () => {
    // Get the current authenticated user
    const auth = getAuth();
    const user = auth.currentUser;
    const userEmail = user.email; 
    if (user) {
      // Use the User ID as the key in the database
      const userId = user.uid; // This is the Firebase Authentication User ID
      const db = database;
  
      // Sample preferences and theme data (replace with actual data)
      const preferences = {
        Amazon: true,
        Ebay: true,
        Walmart: true
      };
  
      // Sample history data (replace with actual data)
      const history = [
        'https://www.amazon.com/product1',
        'https://www.ebay.com/product2',
        'https://www.walmart.com/product3'
      ];
  
      // Write user data to the database using the User ID as the key
      set(ref(db, 'Users/' + userId), {
        Theme: true, // Change this to a boolean value
        Preferences: preferences,
        History: history,
        Email: userEmail
      });
    }
  };

  return (
    <div className="px-5 py-10 pt-5 w-[360px] bg-white">
      <div className="flex flex-col justify-center items-center">
        <p className="text-m mb-4">Pick where you love to shop for better deals!</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {imageUrls.map((imageUrl, index) => (
          <div key={index} className="bg-[#EFEFEF] rounded-lg w-100 h-20">
            <img src={imageUrl} alt={`Image ${index}`} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <button className="bg-[#FF9C1A] text-white text-base rounded-lg py-2 px-4 transition-colors" onClick={handleContinue}>
          Continue
        </button>
      </div>
      <div className="flex justify-center mt-2">
        <a href="#" className="text-blue-500 hover:underline">
          Skip
        </a>
      </div>
    </div>
  );
};

export default Preferences;

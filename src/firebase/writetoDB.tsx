import { getAuth, onAuthStateChanged } from 'firebase/auth';
import React from 'react';
import { database } from '~firebase';
import { ref, set } from 'firebase/database';

export const writeToDB = (preferences) =>{
    const auth = getAuth();
    const user = auth.currentUser;
    const userEmail = user.email; 
    if (user) 
    {
        const userId = user.uid; // This is the Firebase Authentication User ID
        const db = database;
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
}
import React from 'react'
require('dotenv').config();
const SerpApi = require("google-search-results-nodejs")
const search = new SerpApi.GoogleSearch("9ff5a1b75caee5bb01410bebc61e1014f53a01e8dfa29b28d2e7f23067c0338f")
import google_domains from '../json/google-domains.json'
import { Storage } from "@plasmohq/storage"
import { useUpdateDB } from '~firebase/hooks';
import selectors from '../json/ecommerce_scrape.json'

import axios from 'axios'

interface User {
    displayName: string;
    uid: string;
}

interface PageDataItem {
    PageDetails: any[];
    SearchRes: any[];
}

interface HistoryItem {
    PageData: PageDataItem[] | null
}

interface SearchContextState {
    similiar: any[] | null;
    same: any[] | null;
    user: Partial<User> | null;
    pageData: any[] | null;
    page: string | null;
    trigger: boolean | null;
    darkTheme: boolean | null;
    preferences: any[] | null;
    userData: any[] | null;
    userEmail: any[] | null;
    history: HistoryItem | null;
    apiCalls: any | null;
}

interface SearchContextValue extends SearchContextState {
    runSearchSimiliar: (data: any) => void;
    runSearchImage: (data: any) => void;
    getHTMLData: (data: any) => void;
    handleTheme: () => void;
    initTheme: () => void;
    setUser: React.Dispatch<React.SetStateAction<any>>;
    setAPICalls: React.Dispatch<React.SetStateAction<any>>;
    setPage: React.Dispatch<React.SetStateAction<string>>;
    setHistory: React.Dispatch<React.SetStateAction<any>>;
    setPreferences: React.Dispatch<React.SetStateAction<string>>;
    setDark: React.Dispatch<React.SetStateAction<boolean>>;
    setUserData: React.Dispatch<React.SetStateAction<string>>;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    setPageData: React.Dispatch<React.SetStateAction<string>>;
}

const MySearchContext = React.createContext<SearchContextValue>({
    runSearchSimiliar: () => {},
    runSearchImage: () => {},
    setUser: () => {},
    handleTheme: () => {},
    getHTMLData: () => {},
    setPage: () => {},
    setPageData: () => {},
    setPreferences: () => {},
    setUserData: () => {},
    setEmail: () => {}, 
    setHistory: () => {},
    setDark: () => {},
    setAPICalls: () => {},
    initTheme: () => {},
    user: null,
    similiar: null,
    same: null,
    pageData: null,
    page: null,
    trigger: false,
    darkTheme: false,
    preferences: null,
    userData: null,
    userEmail: null,
    history: null,
    apiCalls: null
});

export const MySearchProvider = ({ children }) => {
    const storage = new Storage()
    const [similiar, setSimiliar] = React.useState(null)
    const [user, setUser] = React.useState(null); 
    const [userEmail, setEmail] = React.useState(null); 
    const [same, setSame] = React.useState(null);
    const [country, setCountry] = React.useState(null)
    const [pageData, setPageData] = React.useState(null)
    const [page, setPage] = React.useState(null);
    const [apiCalls, setAPICalls] = React.useState(null)
    const [trigger, setTrigger] = React.useState(false)
    const [darkTheme, setDark] = React.useState(false)
    const [preferences, setPreferences] = React.useState(null)
    const [history, setHistory] = React.useState(null)
    const [userData, setUserData] = React.useState(null)

    const initTheme = async() => {
        const theme = await storage.get('dark') as boolean
        if(theme != null){
            console.log('theme initialized', theme)
            if(theme === true){
                setDark(true)
            }else if(theme === false){
                setDark(false)
            }
        }
    }

    const handleTheme = async() => {
        await storage.set("dark", !darkTheme)
        console.log('theme set')
        setDark(darkTheme => !darkTheme)
    }
    
    const searchTitle = async(title: string, country: string, currentPrice: any) => {
        
        let params = {
            api_key: process.env.PLASMO_PUBLIC_API_KEY_SIMILAR, 
            q: title,       
            gl: country,
            google_domain: google_domains.find(g => g.country_code == country)?.domain,
            engine: 'google_shopping',             
        }
        search.json(params, (data: any) => {
            console.log("raw data from similar search:",data)
            const numericValue = parseFloat(currentPrice.replace(/[^0-9.]/g, ''));
            const itemsWithPrice = data.shopping_results.filter(item => item.price && item.extracted_price <= numericValue)
            const sortedItems = itemsWithPrice.sort((a, b) => a.extracted_price - b.extracted_price)
            const sortByPref = sortedItems.filter(prod => {
                if(preferences && preferences.some(p => prod.link.includes(p.toLowerCase())) || preferences.includes("other")){
                    return prod
                }
            })
            console.log("similar search results:",sortByPref);
            setSimiliar(sortByPref)
        })
    }

    const getLocation = async() => {
        try{
            const response = await axios.get("https://ipinfo.io");
            setCountry(response.data.country.toLowerCase())
            return response.data.country.toLowerCase()
        }catch(error){
            console.log(error)
        }
    }
  
    const updateToDB = useUpdateDB();
    const runSearchSimiliar = (data: any) => {
        if (data && apiCalls < 5) {
            setAPICalls(apiCalls => apiCalls + 1)
            // updateToDB({
            //     APICalls: apiCalls
            // });
            console.log('runSearchSimilar is called');
            if (!country) {
                getLocation()
                .then((country) => {
                    setCountry(country);
                    searchTitle(data[0], country, data[2]);
                });
            } else {
                searchTitle(data[0], country, data[2]);
            }
        }else{
            console.log('api calls exceeded')
        }
      }
      
      
    const runSearchImage = (data: any) => {
        if(data && apiCalls < 5){
            setAPICalls(apiCalls => apiCalls + 1)
            updateToDB({
                APICalls: apiCalls
            });
            console.log('runSearchImage is called')
            if(!country){
                getLocation()
                    .then(country => {
                        setCountry(country)
                        searchImage(data[1], country, data[2])
                    })
            }else{
                searchImage(data[1], country, data[2])
            }
        }else{
            console.log('api calls exceeded')
        }
    }

    const searchImage = async(image: any, country: any, currentPrice: any) => {
        let params = {
            api_key: process.env.PLASMO_PUBLIC_API_KEY_SIMILAR, 
            gl: country,            
            url: image,       
            engine: 'google_lens',    
            google_domain: google_domains.find(g => g.country_code == country)?.domain,
        }
        const numericValue = parseFloat(currentPrice.replace(/[^0-9.]/g, ''));
        search.json(params, async (data) => {
            if (data && data["visual_matches"] && data["visual_matches"].length > 0) {
                // Filter out items that don't have a "price" property
                console.log("pass 0: raw data no items filtered", data)
                const itemsWithPrice = data["visual_matches"].filter(item => item.price && item.price.extracted_value <= numericValue);
                // filter items not in country
                console.log("pass 1 items without price removed:" ,itemsWithPrice)
                // const allowedDomains = ['.com', country] 
                const allowedDomains = [country] 
                const itemsInLocation = itemsWithPrice.filter(item => {
                    const itemDomain = new URL(item.link).hostname.toLowerCase();
                    return allowedDomains.some(allowedDomain => itemDomain.endsWith(allowedDomain));
                });

                console.log('pass 2 out of location removed (domain not .com/country):',itemsInLocation);
                const itemPromises = itemsInLocation.map(async (item) => {
                    try {
                        const response = await axios.get(item.link);
                        item.pageContent = response.data; // Store the webpage content
                        return item;
                    } catch (error) {
                        item.pageContent = null
                        return item; 
                    }
                });
                const itemsWithPageContent = await Promise.all(itemPromises);
                console.log('pass 3 items without page content are removed', itemsWithPageContent)
                // Filter out items that contain "out of stock" in their webpage content
                const filteredItems = itemsWithPageContent.map(item => {
                    if (typeof item.pageContent === 'string') {
                        const pageContentLower = item.pageContent.toLowerCase();
                        if (
                            pageContentLower.includes('out of stock') ||
                            pageContentLower.includes('no longer available') ||
                            pageContentLower.includes('unavailable') ||
                            pageContentLower.includes('sold out')
                        ) {
                            item.isOutOfStock = true; // Mark the product as out of stock
                        } else {
                            item.isOutOfStock = false; // Mark the product as available
                        }
                    } else {
                        item.isOutOfStock = false; // Mark the product as available if no page content
                    }
                    return item;
                });
                const sortedItems = filteredItems.sort((a, b) => a.price.extracted_value - b.price.extracted_value);
                console.log("preferences: ",preferences)
                const sortByPref = sortedItems.filter(prod => {
                    if(preferences && preferences.some(p => prod.link.includes(p.toLowerCase())) || preferences.includes("Others")){
                        return prod
                    }
                    
                    console.log("not in preference: ", prod.link)
                })
                console.log("pass 4 - websites not in preferences removed:",sortByPref);
                setSame(sortByPref);
            }
        });
    }

    const getHTMLData = async(tab: any) => {
        try {
            if (tab) {
                const [result] = await chrome.scripting.executeScript({
                    target: { tabId: tab.tabId || tab.id },
                    func: (selectors, url) => {
                        console.log('getHTMLData is called', url)
                        let domain = '';
                        if (url.includes('amazon')) {
                            domain = 'amazon';
                        }
                        else if (url.includes('ebay')){
                            domain = 'ebay';
                        }
                        else if (url.includes('walmart')){
                            domain = 'walmart';
                        }
                        else if (url.includes('bestbuy')){
                            domain = 'bestbuy';
                        }

                        const { title: titleSelector, price: priceSelector, image: imageSelector } = selectors[domain] || {}

                        const currentDate = new Date().toLocaleDateString();

                        const productTitle = document.querySelector(titleSelector)?.innerHTML || "";
        
                        const price = document.querySelector(priceSelector)?.innerHTML || "";
                        
                        const image = document.querySelector(imageSelector)?.getAttribute('src') || "";
                        
                        return [
                            productTitle.replace(/ {2,}/g, ''),
                            image,
                            price,
                            currentDate,
                            url
                        ]
                    },
                    args: [selectors, tab.url]
                });
                const { title: titleSelector, price: priceSelector, image: imageSelector } = selectors["amazon"] || {};

                console.log(titleSelector, priceSelector, imageSelector, "amazon")
                const data = result.result;
                if(data){
                    setTrigger(true)
                }
                chrome.storage.local.set({ 'data': data })
                setPageData(data || null)
                console.log('page data set', data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <MySearchContext.Provider value={{ 
            initTheme,
            handleTheme,
            runSearchSimiliar,
            runSearchImage,
            setUser,
            setAPICalls,
            getHTMLData,
            setPage,
            setPageData,
            setPreferences,
            setUserData,
            setEmail,
            setHistory,
            setDark,
            apiCalls,
            darkTheme,
            user,
            similiar,
            same,
            pageData,
            page,
            trigger,
            preferences,
            userData,
            userEmail,
            history,
        }}>
        {children}
        </MySearchContext.Provider>
    );
};
export const useSearchContext =  () => React.useContext(MySearchContext)
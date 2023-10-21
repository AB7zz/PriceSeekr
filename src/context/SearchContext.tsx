import React from 'react'
require('dotenv').config();
const SerpApi = require("google-search-results-nodejs")
const search = new SerpApi.GoogleSearch("9ff5a1b75caee5bb01410bebc61e1014f53a01e8dfa29b28d2e7f23067c0338f")
import google_domains from '../json/google-domains.json'

import axios from 'axios'

interface User {
    displayName: string;
    uid: string;
}

interface SearchContextState {
    similiar: any[] | null;
    same: any[] | null;
    user: Partial<User> | null;
    pageData: any[] | null;
    page: string | null;
    trigger: boolean | null;
    preferences: any[] | null;
    userData: any[] | null;
    userEmail: any[] | null;
    history: any[] | null;
}

interface SearchContextValue extends SearchContextState {
    runSearchSimiliar: (data: any) => void;
    runSearchImage: (data: any) => void;
    getHTMLData: (data: any) => void;
    setUser: React.Dispatch<React.SetStateAction<any>>;
    setPage: React.Dispatch<React.SetStateAction<string>>;
    setHistory: React.Dispatch<React.SetStateAction<any>>;
    setPreferences: React.Dispatch<React.SetStateAction<string>>;
    setUserData: React.Dispatch<React.SetStateAction<string>>;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    setPageData: React.Dispatch<React.SetStateAction<string>>;
}

const MySearchContext = React.createContext<SearchContextValue>({
    runSearchSimiliar: () => {},
    runSearchImage: () => {},
    setUser: () => {},
    getHTMLData: () => {},
    setPage: () => {},
    setPageData: () => {},
    setPreferences: () => {},
    setUserData: () => {},
    setEmail: () => {}, 
    setHistory: () => {},
    user: null,
    similiar: null,
    same: null,
    pageData: null,
    page: null,
    trigger: false,
    preferences: null,
    userData: null,
    userEmail: null,
    history: null,
});

export const MySearchProvider = ({ children }) => {
    const [similiar, setSimiliar] = React.useState(null)
    const [user, setUser] = React.useState(null); 
    const [userEmail, setEmail] = React.useState(null); 
    const [same, setSame] = React.useState(null);
    const [country, setCountry] = React.useState(null)
    const [pageData, setPageData] = React.useState(null)
    const [page, setPage] = React.useState(null);
    const [trigger, setTrigger] = React.useState(false)
    const [preferences, setPreferences] = React.useState(null)
    const [history, setHistory] = React.useState(null)
    const [userData, setUserData] = React.useState(null)
    
    const searchTitle = async(title: string, country: string, currentPrice: any) => {
        
        let params = {
            api_key: "9ff5a1b75caee5bb01410bebc61e1014f53a01e8dfa29b28d2e7f23067c0338f", 
            q: title,       
            gl: country,
            google_domain: google_domains.find(g => g.country_code == country)?.domain,
            engine: 'google_shopping',             
        }
        search.json(params, (data: any) => {
            console.log("raw data from similar search:",data)
            const numericValue = parseFloat(currentPrice.replace(/[^0-9.]/g, ''));
            const itemsWithPrice = data["shopping_results"].filter(item => item.price && item.extracted_price <= numericValue)
            const sortedItems = itemsWithPrice.sort((a, b) => a.extracted_price - b.extracted_price)
            const sortByPref = sortedItems.filter(prod => {
                if(preferences.some(p => prod.link.includes(p.toLowerCase())) || preferences.includes("other")){
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
  
    const runSearchSimiliar = (data: any) => {
        if (data) {
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
        }
      }
      
      
    const runSearchImage = (data: any) => {
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
    }

    const searchImage = async(image: any, country: any, currentPrice: any) => {
        let params = {
            api_key:"4ede514098f0aaed97b7659099bcebc41d4015a987a506f23ab7a6c4be65063f", 
            url: image,       
            engine: 'google_lens',                
        }
        const numericValue = parseFloat(currentPrice.replace(/[^0-9.]/g, ''));
        search.json(params, async (data) => {
            if (data && data["visual_matches"] && data["visual_matches"].length > 0) {
                // Filter out items that don't have a "price" property
                console.log("pass 0: raw data no items filtered", data)
                const itemsWithPrice = data["visual_matches"].filter(item => item.price && item.price.extracted_value <= numericValue);
                // filter items not in country
                console.log("pass 1 items without price removed:" ,itemsWithPrice)
                const allowedDomains = ['.com', country] 
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
                    if(preferences.some(p => prod.link.includes(p.toLowerCase())) || preferences.includes("Others")){
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
                    func: (url) => {
                        let productTitle, image, price
                        const currentDate = new Date().toLocaleDateString();
                        if (url.includes('ebay')) {
                            productTitle = document.querySelector(".x-item-title__mainTitle .ux-textspans")?.innerHTML || "";
                            image = document.querySelector('img.a-dynamic-image')?.getAttribute('src') || document.querySelector('img.ux-image-magnify__image--original')?.getAttribute('src') || "";
                            price = document.querySelector('.x-price-primary .ux-textspans')?.innerHTML || "";
                            return [productTitle, image, price, currentDate, url]
                        } else if (url.includes('amazon')) {
                            productTitle = document.querySelector('#productTitle')?.innerHTML || "";
                            image = document.querySelector('#landingImage')?.getAttribute('src') || document.querySelector("img.a-dynamic-image")?.getAttribute('src') || "";
                            price = document.querySelector('.a-offscreen')?.innerHTML || "";
                            return [productTitle.replace(/ {2,}/g, ''), image, price, currentDate, url]
                        } else if (url.includes('walmart')){
                            productTitle = document.querySelector("#main-title")?.innerHTML || "";
                            image = document.querySelector('[data-testid="hero-image-container"] img')?.getAttribute("src") || ""
                            price = document.querySelector('[itemprop="price"]')?.innerHTML
                            return [productTitle, image, price, currentDate, url]
                        } else if (url.includes('bestbuy')){
                            productTitle = document.querySelector(".shop-product-title h1")?.innerHTML || ""
                            image = document.querySelector(".primary-image")?.getAttribute("src") || ""
                            price = document.querySelector('[data-testid="customer-price"] span')?.innerHTML || ""
                            return [productTitle, image, price, currentDate, url]
                        }
                    },
                    args: [tab.url]
                });
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
            runSearchSimiliar,
            runSearchImage,
            setUser,
            getHTMLData,
            setPage,
            setPageData,
            setPreferences,
            setUserData,
            setEmail,
            setHistory,
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
import React from 'react'
require('dotenv').config();
const SerpApi = require("google-search-results-nodejs")
const search = new SerpApi.GoogleSearch("9ff5a1b75caee5bb01410bebc61e1014f53a01e8dfa29b28d2e7f23067c0338f")
import google_domains from '../json/google-domains.json'

import axios from 'axios'

interface User {
    displayName: string;
}

interface SearchContextState {
    similiar: any[] | null;
    same: any[] | null;
    user: Partial<User> | null;
    pageData: any[] | null;
    page: string | null;
    trigger: boolean | null;
}

interface SearchContextValue extends SearchContextState {
    runSearchSimiliar: (data: any) => void;
    runSearchImage: (data: any) => void;
    getHTMLData: (data: any) => void;
    setUser: React.Dispatch<React.SetStateAction<any>>;
    setPage: React.Dispatch<React.SetStateAction<string>>;
}

const MySearchContext = React.createContext<SearchContextValue>({
    runSearchSimiliar: () => {},
    runSearchImage: () => {},
    setUser: () => {},
    getHTMLData: () => {},
    setPage: () => {},
    user: null,
    similiar: null,
    same: null,
    pageData: null,
    page: null,
    trigger: false
});

export const MySearchProvider = ({ children }) => {
    const [similiar, setSimiliar] = React.useState(null)
    const [user, setUser] = React.useState(null); 
    const [same, setSame] = React.useState(null);
    const [country, setCountry] = React.useState(null)
    const [pageData, setPageData] = React.useState(null)
    const [page, setPage] = React.useState(null);
    const [trigger, setTrigger] = React.useState(false)
    
    const searchTitle = async(title: string, country: string, currentPrice: any) => {
        let params = {
            api_key: "9ff5a1b75caee5bb01410bebc61e1014f53a01e8dfa29b28d2e7f23067c0338f", 
            q: title,       
            gl: country,
            google_domain: google_domains.find(g => g.country_code == country)?.domain,
            engine: 'google_shopping',             
        }
        search.json(params, (data: any) => {
            const preference = ["amazon", "ebay", "walmart", "bestbuy", "other"]
            const numericValue = parseFloat(currentPrice.replace(/[^0-9.]/g, ''));
            const itemsWithPrice = data["shopping_results"].filter(item => item.price && item.extracted_price <= numericValue)
            const sortedItems = itemsWithPrice.sort((a, b) => a.extracted_price - b.extracted_price)
            const sortByPref = sortedItems.filter(prod => {
                if(preference.some(p => prod.link.includes(p)) || preference.includes("other")){
                    return prod
                }
            })
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
        if(data){
            console.log('runSearchSimiliar is called')
            if(!country){
                getLocation()
                    .then(country => {
                        setCountry(country)
                        searchTitle(data[0], country, data[2])
                    })
            }else{
                searchTitle(data[0], country, data[2])
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
                const itemsWithPrice = data["visual_matches"].filter(item => item.price && item.price.extracted_value <= numericValue);
                // filter items not in country
                const allowedDomains = ['.com', country] 
                const itemsInLocation = itemsWithPrice.filter(item => {
                    const itemDomain = new URL(item.link).hostname.toLowerCase();
                    return allowedDomains.some(allowedDomain => itemDomain.endsWith(allowedDomain));
                  });
                // console.log(itemsInLocation)
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
    
                // Filter out items that contain "out of stock" in their webpage content
                const filteredItems = itemsWithPageContent.filter(item => {
                    if (typeof item.pageContent === 'string') {
                        const pageContentLower = item.pageContent.toLowerCase();
                        return !(
                            pageContentLower.includes('out of stock') ||
                            pageContentLower.includes('no longer available') || 
                            pageContentLower.includes('sold out')
                        );
                    }
                    return true; // Include items without webpage content
                });
                const sortedItems = filteredItems.sort((a, b) => a.price.extracted_value - b.price.extracted_value);
                setSame(sortedItems);
            }
            else{
                setSame(["Not found"])
            }
        });
    }

    const getHTMLData = async(tab: any) => {
        try {
            if (tab) {
                const [result] = await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    func: (url) => {
                        let productTitle, image, price
                        if (url.includes('ebay')) {
                            productTitle = document.querySelector(".x-item-title__mainTitle .ux-textspans")?.innerHTML || "";
                            image = document.querySelector('img.a-dynamic-image')?.getAttribute('src') || document.querySelector('img.ux-image-magnify__image--original')?.getAttribute('src') || "";
                            price = document.querySelector('.x-price-primary .ux-textspans')?.innerHTML || "";
                            return [productTitle, image, price]
                        } else if (url.includes('amazon')) {
                            productTitle = document.querySelector('#productTitle')?.innerHTML || "";
                            image = document.querySelector('#landingImage')?.getAttribute('src') || document.querySelector("img.a-dynamic-image")?.getAttribute('src') || "";
                            price = document.querySelector('.a-offscreen')?.innerHTML || "";
                            return [productTitle.replace(/ {2,}/g, ''), image, price]
                        } else if (url.includes('walmart')){
                            productTitle = document.querySelector("#main-title")?.innerHTML || "";
                            image = document.querySelector('[data-testid="hero-image-container"] img')?.getAttribute("src") || ""
                            price = document.querySelector('[itemprop="price"]')?.innerHTML
                            return [productTitle, image, price]
                        } else if (url.includes('bestbuy')){
                            productTitle = document.querySelector(".shop-product-title h1")?.innerHTML || ""
                            image = document.querySelector(".primary-image")?.getAttribute("src") || ""
                            price = document.querySelector('[data-testid="customer-price"] span')?.innerHTML || ""
                            return [productTitle, image, price]
                        }
                    },
                    args: [tab.url]
                });
                const data = result.result;
                if(data){
                    setTrigger(true)
                }
                console.log("your data: ",data)
                chrome.storage.local.set({ 'data': data })
                setPageData(data || 'none')
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
            user,
            similiar,
            same,
            pageData,
            page,
            trigger
        }}>
        {children}
        </MySearchContext.Provider>
    );
};
export const useSearchContext =  () => React.useContext(MySearchContext)
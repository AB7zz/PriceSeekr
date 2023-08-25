import React from 'react'
const SerpApi = require("google-search-results-nodejs")
const search = new SerpApi.GoogleSearch("9ff5a1b75caee5bb01410bebc61e1014f53a01e8dfa29b28d2e7f23067c0338f")
import google_domains from '../json/google-domains.json'
import axios from 'axios'

interface SearchContextState {
    similiar: any[] | null;
    same: any[] | null;
}

interface SearchContextValue extends SearchContextState {
    runSearchSimiliar: (data: any) => void;
    runSearchImage: (data: any) => void;
}

const MySearchContext = React.createContext<SearchContextValue>({
    runSearchSimiliar: () => {},
    runSearchImage: () => {},
    similiar: null,
    same: null,
});

export const MySearchProvider = ({ children }) => {
    const [similiar, setSimiliar] = React.useState(null)
    const [same, setSame] = React.useState(null);
    const [country, setCountry] = React.useState(null)
    const searchTitle = async(title: string, country: string, currentPrice: any) => {
        let params = {
            api_key: "9ff5a1b75caee5bb01410bebc61e1014f53a01e8dfa29b28d2e7f23067c0338f", 
            q: title,       
            gl: country,
            google_domain: google_domains.find(g => g.country_code == country)?.domain,
            engine: 'google_shopping',             
        }
        search.json(params, (data: any) => {
            const numericValue = parseFloat(currentPrice.replace(/[^0-9.]/g, ''));
            const itemsWithPrice = data["shopping_results"].filter(item => item.price && parseFloat(item.price.replace(/[^0-9.]/g, '')) <= numericValue)
            const sortedItems = itemsWithPrice.sort((a, b) => parseFloat(a.price.replace(/[^0-9.]/g, '')) - parseFloat(b.price.replace(/[^0-9.]/g, '')))
            setSimiliar(sortedItems)
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
        console.log('Country: ', country)
        let params = {
            api_key: "4ede514098f0aaed97b7659099bcebc41d4015a987a506f23ab7a6c4be65063f", 
            gl: country,
            google_domain: google_domains.find(g => g.country_code == country)?.domain,
            url: image,       
            engine: 'google_lens',                
        }
        const numericValue = parseFloat(currentPrice.replace(/[^0-9.]/g, ''));
        search.json(params, async (data) => {
            if (data && data["visual_matches"] && data["visual_matches"].length > 0) {
                console.log(numericValue)
                // Filter out items that don't have a "price" property
                const itemsWithPrice = data["visual_matches"].filter(item => item.price && item.price.extracted_value <= numericValue);
                console.log(itemsWithPrice)
    
                // Use Promise.all to fetch webpage content for each item
                const itemPromises = itemsWithPrice.map(async (item) => {
                    try {
                        const response = await axios.get(item.link);
                        item.pageContent = response.data; // Store the webpage content
                        return item;
                    } catch (error) {
                        // console.error(`Error fetching ${item.link}: ${error.message}`);
                        item.pageContent = null
                        return item; // Handle errors gracefully
                    }
                });
    
                const itemsWithPageContent = await Promise.all(itemPromises);
    
                // Filter out items that contain "out of stock" in their webpage content
                const filteredItems = itemsWithPageContent.filter(item => {
                    if (item.pageContent) {
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
        });
    }

    return (
        <MySearchContext.Provider value={{ 
            runSearchSimiliar,
            runSearchImage,
            similiar,
            same,
        }}>
        {children}
        </MySearchContext.Provider>
    );
};

export const useSearchContext =  () => React.useContext(MySearchContext)
import React from 'react'
const SerpApi = require("google-search-results-nodejs")
const search = new SerpApi.GoogleSearch("9ff5a1b75caee5bb01410bebc61e1014f53a01e8dfa29b28d2e7f23067c0338f")
import google_domains from '../json/google-domains.json'
import axios from 'axios'

interface SearchContextState {
    similiar: any[] | null;
}

interface SearchContextValue extends SearchContextState {
    runSearch: (data: any) => void;
}

const MySearchContext = React.createContext<SearchContextValue>({
    runSearch: () => {},
    similiar: null,
});

export const MySearchProvider = ({ children }) => {
    const [similiar, setSimiliar] = React.useState(null)
    const searchTitle = async(title: string, country: string) => {
        let params = {
            api_key: "9ff5a1b75caee5bb01410bebc61e1014f53a01e8dfa29b28d2e7f23067c0338f", 
            q: title,       
            gl: country,
            google_domain: google_domains.find(g => g.country_code == country)?.domain,
            engine: 'google_shopping',             
        }
        search.json(params, (data: any) => {
            console.log(data["shopping_results"])
            setSimiliar(data["shopping_results"])
        })
    }

    const getLocation = async() => {
        try{
            const response = await axios.get("https://ipinfo.io");
            return response.data.country.toLowerCase()
        }catch(error){
            console.log(error)
        }
    }
  
    const runSearch = (data: any) => {
        if(data){
            console.log('runSearch is called')
            getLocation()
            .then(country => searchTitle(data[0], country))
        }
    }

    return (
        <MySearchContext.Provider value={{ 
            runSearch,
            similiar,
        }}>
        {children}
        </MySearchContext.Provider>
    );
};

export const useSearchContext =  () => React.useContext(MySearchContext)
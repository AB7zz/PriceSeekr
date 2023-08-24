import React, { useEffect, useState } from 'react'
const SerpApi = require("google-search-results-nodejs")
const search = new SerpApi.GoogleSearch("4ede514098f0aaed97b7659099bcebc41d4015a987a506f23ab7a6c4be65063f")
import axios from 'axios'


const Same = ({ data }) => {
  const [same, setSame] = useState(null);
  useEffect(() => {
    const searchImage = async(image, country) => {
      console.log(image)
      let params = {
        api_key: "4ede514098f0aaed97b7659099bcebc41d4015a987a506f23ab7a6c4be65063f", 
        gl: country,
        url: image,       
        engine: 'google_lens',     
        location: "Kochi, Kerala, India",            
      }
      let result = search.json(params, async (data) => {
        if (data && data["visual_matches"] && data["visual_matches"].length > 0) {
          // Filter out items that don't have a "price" property
          const itemsWithPrice = data["visual_matches"].filter(item => item.price);

          // Use Promise.all to fetch webpage content for each item
          const itemPromises = itemsWithPrice.map(async (item) => {
            try {
              const response = await axios.get(item.link);
              item.pageContent = response.data; // Store the webpage content
              return item;
            } catch (error) {
              console.error(`Error fetching ${item.link}: ${error.message}`);
              return null; // Handle errors gracefully
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
    const getLocation = async() => {
      try{
        const response = await axios.get("https://ipinfo.io");
        return response.data.country.toLowerCase()
      }catch(error){
        console.log(error)
      }
    }
    if(data){
      getLocation()
        .then(country => searchImage(data[0], country))
    }
  }, [data]);

  return (
    <div className="px-5 py-5 w-[500px] bg-white">
      <div>
        <h1 className='text-xl font-bold my-3'>Your product</h1>
        {data && 
          <div className='shadow-lg px-3 py-3 rounded-[15px] bg-white'>
            <img className='w-[200px]' src={data[1]} alt="" />
            <h3 className='text-lg'>{data[0]}</h3>
            <p className='text-blue-500 text-lg font-bold'>{data[2]}</p>
          </div>
        }
      </div>
      <div>
        <h1 className='text-xl font-bold my-3'>Same products</h1>
        <div className='grid grid-cols-2 gap-4'>
          {same && same.map((product, i) => (
            <div className='shadow-lg px-3 py-3 rounded-[15px] bg-gray-100'>
              <img className='w-[200px]' src={product.thumbnail} alt="product thumbnail" />
              <a href={product.link} className="text-lg">{product.title}</a>
              {product.price && (
                <p className="text-blue-500 text-lg font-bold">{product.price.value}</p>
              )}
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default Same

import React, { useEffect, useState } from 'react'
const SerpApi = require("google-search-results-nodejs")
const search = new SerpApi.GoogleSearch("9ff5a1b75caee5bb01410bebc61e1014f53a01e8dfa29b28d2e7f23067c0338f")
import axios from 'axios'
import google_domains from '../json/google-domains.json'

const Similiar = ({data}) => {
  const [similiar, setSimiliar] = useState(null)
  useEffect(() => {
    const searchTitle = async(title, country) => {
      let params = {
        api_key: "9ff5a1b75caee5bb01410bebc61e1014f53a01e8dfa29b28d2e7f23067c0338f", 
        q: title,       
        gl: country,
        google_domain: google_domains.find(g => g.country_code == country)?.domain,
        engine: 'google_shopping',             
      }
      let result = search.json(params, (data) => {
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
    if(data){
      getLocation()
        .then(country => searchTitle(data[0], country))
    }
  }, [data])
  return (
    <div className="px-5 py-5 w-[500px] bg-slate-100">
      <div>
        <h1 className='text-xl font-bold my-3'>Your product</h1>
        {data && 
          <div className='shadow-lg px-3 py-3 rounded-[15px] bg-white'>
            <img className='w-[200px]' src={data[2]} alt="" />
            <h3 className='text-lg'>{data[0]}</h3>
            <p className='text-blue-500 text-lg font-bold'>{data[1]}</p>
          </div>
        }
      </div>
      <div>
        <h1 className='text-xl font-bold my-3'>Similiar products</h1>
        <div className='grid grid-cols-2 gap-4'>
          {similiar && 
            similiar.map((product, i) => (
              <div key={i} className='shadow-lg px-3 py-3 rounded-[15px] bg-white'>
                <img className='w-[200px]' src={product.thumbnail} alt="product thumbnail" />
                <a href={product.link} className="text-lg">{product.title}</a>
                <p className="text-blue-500 text-lg font-bold">{product.price}</p>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  )
}

export default Similiar
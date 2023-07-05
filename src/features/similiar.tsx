import React, { useEffect, useState } from 'react'
import SerpApi from "google-search-results-nodejs"
const search = new SerpApi.GoogleSearch("9ff5a1b75caee5bb01410bebc61e1014f53a01e8dfa29b28d2e7f23067c0338f")


const Similiar = ({data}) => {
  const [similiar, setSimiliar] = useState(null)
  useEffect(() => {
    const searchTitle = async(title) => {
      let params = {
        api_key: "9ff5a1b75caee5bb01410bebc61e1014f53a01e8dfa29b28d2e7f23067c0338f", 
        q: title,       
        engine: 'google_shopping',             
        location: "Austin, TX",            
      }
      let result = search.json(params, (data) => {
        console.log(data["shopping_results"])
        setSimiliar(data["shopping_results"])
      })
    }
    if(data){
      searchTitle(data[0])
    }
  }, [data])
  return (
    <div>
      {similiar && 
        similiar.map((product, i) => (
          <div key={i}>
            <h1 className="text-xl font-bold">{product.title}</h1>
          </div>
        ))
      }
    </div>
  )
}

export default Similiar
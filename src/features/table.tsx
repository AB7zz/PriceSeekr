import React, {useState, useEffect} from 'react'
import { Link } from 'react-router-dom'

const Table = ({data}) => {
  const [page, setPage] = useState('/')
  useEffect(() => {
    if(data){
      document.getElementById("desc").innerHTML = data[4]
    }
  }, [data])
  return (
    <>
    <h1 className='text-2xl text-center py-5'>Product Details</h1>
    <div className="flex items-center justify-center px-5 pb-5">
      <table className="table-auto">
        <thead>
          <tr className="border">
            <th>Image</th>
            <th>Title</th>
            <th>Price</th>
            <th className='pr-[320px]'>Description</th>
          </tr>
        </thead>
        <tbody>
          {data ? <tr className="border">
            <td><img className="!max-w-[100px]" src={data[2]} /></td>
            <td>{data[0]}</td>
            <td>{data[1]}</td>
            <td id="desc"></td>
          </tr> : <tr className="border">
            <td><img src="" /></td>
            <td>Random Title testing</td>
            <td>Random price</td>
            <td>Random Description</td>
          </tr>}
        </tbody>
      </table>
    </div>
    </>
  )
}

export default Table
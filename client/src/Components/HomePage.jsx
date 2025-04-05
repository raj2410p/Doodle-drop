import React ,{useEffect,useState}from 'react'
import axios from 'axios'


  export const HomePage = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:3001/api/notes")  
      .then((response) => setData(response.data))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <>
  
    <div>
      <h1>API Data</h1>
      {data ? <pre>{JSON.stringify(data,  2)}</pre> : "Loading..."}
    </div>
    
    </>
  )
}
export default HomePage
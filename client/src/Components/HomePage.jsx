import React, { useEffect, useState } from 'react';
import axios from 'axios';

export const HomePage = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:3001/')
      .then((response) => setData(response.data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-3xl">
        <h1 className="text-2xl font-bold mb-4 text-center text-blue-700">API Data</h1>
        {data ? (
          <pre className="bg-gray-100 p-4 rounded overflow-x-auto text-sm text-gray-800 whitespace-pre-wrap">
            {JSON.stringify(data, null, 2)}
          </pre>
        ) : (
          <p className="text-center text-gray-500">Loading...</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;

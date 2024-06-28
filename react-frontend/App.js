import './App.css';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DragNDrop from "./dnd/DragNDrop"

function App() {
    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get('/')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error("There was an error fetching the data!", error);
            });
    }, []);
    
  return (
      <div>
          Slow and Reverb Generator
          {data ? <h1>{data.message}</h1> : <h1>Loading...</h1>}
          <DragNDrop onFilesSelected={setData} width='700px' height='400px' />
      </div>
  );
}

export default App;
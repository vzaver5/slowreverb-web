import './App.css';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DragNDrop from "./dnd/DragNDrop"
import { motion } from "framer-motion";

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
            <div className="Title" style={{ display: "flex" }}>
                {"Slow And Reverb Generator".split("").map((char, index) => (
                <motion.span
                    key={index}
                    initial={{ y: 0, x: 0, opacity: .5}}
                    animate={{ y: 40, x: 30, opacity: 1 }}
                    transition={{
                        delay: index * .1,
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "mirror"
                    }}
                    style={{ display: "inline-block" }}
                >
                    {char}
                </motion.span>
                ))}
            </div>
            <DragNDrop onFilesSelected={setData} width='1000px' height='200px' />
      </div>
  );
}

export default App;
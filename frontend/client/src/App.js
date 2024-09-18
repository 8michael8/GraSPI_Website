import React, {useState, useEffect, useRef} from 'react';
import './App.css';

function App() {
useEffect(() => {
  fetch("http://localhost:5000/api/test")
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    })
    .catch((error) => {
      console.error("Error connecting to backend:", error);
    });
}, []);



  return (
    <div className="App">
        <h1> Hello GraSPI!! </h1>
    </div>
  );
}

export default App;

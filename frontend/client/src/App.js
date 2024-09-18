import React, { useEffect } from 'react';
import './App.css';
import { gsap } from "gsap";

function App() {

  useEffect(() => {
    const body = document.body;
    const overlay = document.createElement("div");

    // Style the overlay to cover the entire screen
    overlay.style.position = "fixed";
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "black";
    overlay.style.zIndex = -1;

    body.appendChild(overlay);


    // Animate the background transition
    gsap.to(overlay, {
      duration: 1.2,
      y: "-100%", // Move the overlay up to hide it
      ease: "power2.inOut",
    });

    gsap.to(".homePage h1", {
      color: "black", // Change text color to black
      duration: 0.0,
      delay: 0.6,
      ease: "none"
    });

  }, []);

  // This useEffect handles the fetch call to your API
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
    <div className="homePage">
      <h1>
        <span className="line">GraSPI!!</span>
      </h1>
    </div>
  );
}

export default App;

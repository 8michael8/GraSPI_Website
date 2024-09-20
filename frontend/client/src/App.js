import React, { useEffect } from 'react';
import './App.css';
import { gsap } from "gsap";
import snap from './images/snap.png';

function App() {
    const animation = gsap.timeline();
  useEffect(() => {

    let path = document.querySelector("path");
    let pathLength = path.getTotalLength();

    path.style.strokeDasharray = pathLength + ' ' + pathLength;
    path.style.strokeDashoffset = pathLength;

    window.addEventListener("scroll", () => {
        //calculate % down
        var scrollPercentage = (document.documentElement.scrollTop + document.body.scrollTop) / (document.documentElement.scrollHeight - document.documentElement.clientHeight);
        //Length to offset the dashes
        var drawLength = pathLength * scrollPercentage;
        //draw in reverse
        path.style.strokeDashoffset = pathLength - drawLength;
    })


    const targets = document.querySelectorAll(".homePage .graspiDesc div");
    const numberOfTargets = targets.length;
    const duration = 2;
    const repeatDelay = duration * (numberOfTargets-1)

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

    gsap.to(".homePage .title h1", {
      y: (i, target) => {
        if (target.classList.contains("t2") || target.classList.contains("t4")) {
          return "8vh";
        } else {
          return "-8vh";
        }
      },
      opacity: 1,
      duration: 1,
      ease: "power2.out",
      onComplete: () =>{

    gsap.to(".homePage .title h1 span", {
      opacity: 0,       // Fade in
      duration: 1,      // Duration of fade
      stagger: 0.2,     // Stagger the fading of each span
      ease: "power1.out" // Easing function
    });

    // Step 2: Move each letter towards the center to form the word
    gsap.to(".homePage .title h1", {
      x: (i) => {
        if (i === 0) return '25.4vw';
        if (i === 1) return '10.2vw';
        if (i === 2) return '-3vw';
        else return '-16vw';
      },
      duration: 1.5,
      ease: "power2.out",
      stagger: 0.1,

    }, 2);

      }

    });

    setTimeout(() =>{
            gsap.to(overlay, {
      duration: 1.2,
      y: "-100%",
      ease: "power2.inOut",
    });
    // Change the color immediately
    gsap.set(".homePage .title h1", {
      color: "black",
      delay: 0.8,
      ease: "none",
    });

    // Animate the movement with a duration
    gsap.to(".homePage .title h1", {
       y: (i, target) => {
        if (target.classList.contains("t2") || target.classList.contains("t4")) {
          return "-24vh";
        } else {
          return "-40vh";
        }
      },
      duration: 1.5,
    });

    gsap.set(".homePage .graspiDesc div", {autoAlpha:1, opacity:1})
    animation.from(targets, {y:80, duration:duration, opacity:0, stagger:{
        each:duration,
        repeat:-1,
        repeatDelay:repeatDelay
    }})
    .to(targets, {y:-80, duration:duration, opacity:0, stagger:{
        each:duration,
        repeat:-1,
        repeatDelay:repeatDelay
    }}, duration);

    }, 4000);

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
    <>
      <div className="homePage">
        <div className="title">
          <h1 className="t1">Gra<span>ph-based</span></h1>
          <h1 className="t2">S<span>tructure</span></h1>
          <h1 className="t3">P<span>roperty</span></h1>
          <h1 className="t4">I<span>dentifier</span></h1>
        </div>
        <div className="graspiDesc">
            <div>A powerful C/C++ software package</div>
            <div>Designed for analyzing segmented microstructures using graph theory</div>
            <div>Efficiently computes comprehensive library of descriptors</div>
            <div>Offers deep insights into material properties</div>
            <div>Low computational overhead</div>
        </div>

        {/* Line Container*/}
        <div className="line-container">
            <svg viewBox="0 0 1200 2745" fill="none" preserveAspectRatio="xMidYMax meet">
                <path d="M442 3L7.5 276L187.5 631.5H363L539 983.5L630.75 807.5L722.5 631.5L894.5 983.5V1529H7.5L894.5 2197L7.5 2179L442 2743" stroke="black" strokeWidth="10"/>
            </svg>

        </div>

        {/* End Line Container*/}

      </div>
        <div className="libraries">
            <div className = "snap">
                <img src={snap} alt=""/>

            </div>

            <div className = "igraph">

            </div>

            <div className = "rustworkx">

            </div>

            <div className = "graphTool">

            </div>
      </div>
    </>
  );
}

export default App;

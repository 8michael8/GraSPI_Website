import React, { useEffect, useState } from 'react';
import './App.css';
import { gsap } from "gsap";
import snap from './images/snap.png';
import igraph from './images/igraph.png';
import rustworkx from './images/rustworkx.png'
import graphtool from './images/graphTool.png'

function App() {
    const animation = gsap.timeline();
  useEffect(() => {

    window.scrollTo(0, 0);
        document.body.classList.add('no-scroll');

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
        document.body.classList.remove('no-scroll');
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

    const [isPopupVisible, setPopupVisible] = useState(false);
    const [popupContent, setPopupContent] = useState({ img: "", text: "", header: ""});

    const libTransition = (img, text, header) => {
    document.body.classList.add("no-scroll");
    setPopupContent({ img, text, header });
    setPopupVisible(true);

    setTimeout(() => {
      gsap.to(".popup", {
        duration: 1.2,
        y: "0%",
        ease: "power2.inOut"
      });
    }, 0);
  };

  const closePopup = () => {
    gsap.to(".popup", {
      duration: 1.2,
      y: "150%",
      ease: "power2.inOut",
      onComplete: () => {
        document.body.classList.remove("no-scroll");
            setPopupContent({ img: "", text:"", header: "" });
        setPopupVisible(false);
      }
    });
  };


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
        <div class="circle"></div>

      </div>
        <div className="libraries" >
            <div className="snap" onClick={() => libTransition(snap, "SNAP is a general purpose, high performance system for analysis and manipulation of large networks. SNAP is written in C++ and optimized for maximum performance and compact graph representation. It easily scales to massive networks with hundreds of millions of nodes, and billions of edges.", "SNAP (Stanford Network Analysis Platform)")}>
                <img src={snap} alt="" className="libPic"/>
            </div>

            <div className="igraph" onClick={() => libTransition(igraph, "igraph is a collection of network analysis tools with the emphasis on efficiency, portability, and ease of use. igraph is open source and free. igraph can be programmed in R, Python, Mathematica, and C/C++.", "igraph")}>
                <img src={igraph} alt="" className="libPic"/>
            </div>

            <div className="rustworkx" onClick={() => libTransition(rustworkx, "rustworkx is a Python package for working with graphs and complex networks. It enables the creation, interaction with, and study of graphs and networks.", "rustworkx")}>
                <img src={rustworkx} alt="" className="libPic"/>
            </div>

            <div className="graphtool" onClick={() => libTransition(graphtool, "Graph-tool is an efficient Python module for manipulation and statistical analysis of graphs (a.k.a. networks). Contrary to most other Python modules with similar functionality, the core data structures and algorithms are implemented in C++, making extensive use of template metaprogramming, based heavily on the Boost Graph Library. This confers it a level of performance that is comparable (both in memory usage and computation time) to that of a pure C/C++ library.", "graph-tool")}>
                <img src={graphtool} alt="" className="libPic"/>
            </div>

                  <div class="circle2"></div>
      </div>

    {isPopupVisible && (
        <div className="popup">
            <img src={popupContent.img} alt="Content Image" className="popup-img" />
            <h1 className="popup-h">{popupContent.header}</h1>
            <p className="popup-p">{popupContent.text}</p>
            <button className="close" onClick={closePopup}>X</button>
        </div>
    )}
    </>
  );
}

export default App;

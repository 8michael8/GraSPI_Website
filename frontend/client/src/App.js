import React, { useEffect, useState } from 'react';
import './App.css';
import { gsap } from "gsap";
import snap from './images/snap.png';
import igraph from './images/igraph.png';
import rustworkx from './images/rustworkx.png'
import graphtool from './images/graphTool.png'
import snapCode from './images/snapGraphCode.png'
import snapFiltering from './images/snapFiltering.png'
import snapBFS from './images/snapBFS.png'
import igraphGraph from './images/rustworkxGraph.png'
import igraphFilter from './images/rustworkxFilter.png'
import igraphBFS from './images/rustworkxBFS.png'
import rustGraph from './images/igraphGraph.png'
import rustFilter from './images/igraphFilter.png'
import rustBFS from './images/igraphBFS.png'

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
    overlay.style.zIndex = 5;

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
    const [popupContent, setPopupContent] = useState({ img: "", text: "", header: "", algorithmText: "", filterText: "", bfsText: "", graphCode: "", filterCode: "", bfsCode: ""});
    const [currentSlide, setCurrentSlide] = useState('intro');
    const [error, setError] = useState('');
    const [generatedImage, setGeneratedImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [path, setPath] = useState({});

const libTransition = (library) => {
    document.body.classList.add("no-scroll");
    setPopupContent({ img: library.img, text: library.text, header: library.header, algorithmText: library.algoText, filterText: library.filterText, bfsText: library.bfsText, graphCode: library.graphCode, filterCode: library.filterCode, bfsCode: library.bfsCode });
    setPopupVisible(true);
    setCurrentSlide('intro');
    setTimeout(() => {
        gsap.to(".popup", {
            duration: 1.2,
            y: "0%",
            ease: "power2.inOut"
        });
    }, 0);
};

  const closePopup = () => {
    setGeneratedImage(null);  // Reset generated image
    gsap.to(".popup", {
      duration: 1.2,
      y: "150%",
      ease: "power2.inOut",
      onComplete: () => {
        document.body.classList.remove("no-scroll");
            setPopupContent({ img: "", text:"", header: "", algorithmText: "", filterText: "", bfsText: ""});
        setPopupVisible(false);
      }
    });
  };
const graphCreation = (libraryName, type) => {
    setLoading(true);
    setError(null);
    fetch(`/create/${libraryName}/${type}`, { method: "POST" })
    .then(response => response.json())
    .then(data => {
        setLoading(false);
        if (typeof data.path === 'object' && !Array.isArray(data.path)) {
            setPath(data.path);
        } else if (typeof data.image_path === "string") {
            setGeneratedImage(data.image_path);
        }
    })
    .catch(error => {
        setError(`Failed to load image: ${error.message}`);
        console.error("Fetch error:", error);
    });
};

const downloadPathsAsText = () => {
    if (!path || Object.keys(path).length === 0) {
        setError("No paths to download.");
        return;
    }

    let pathContent = "Graph Paths:\n";
    Object.entries(path).forEach(([nodeID, subPath]) => {
        pathContent += `Node ${nodeID}: ${subPath.join(" -> ")}\n`;
    });

    const blob = new Blob([pathContent], { type: 'text/plain' });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'graph_paths.txt';
    link.target = '_blank';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};




  const libraries = [
    {
        img: snap,
        text: "SNAP is a general purpose, high performance system for analysis and manipulation of large networks. SNAP is written in C++ and optimized for maximum performance and compact graph representation. It easily scales to massive networks with hundreds of millions of nodes, and billions of edges.",
        header: "snap",
                algoText: (
            <ul>
                <li>Graphs are generated using the <code>build_graph</code> function.</li>
                <li>Parameters:</li>
                <ul>
                    <li><strong>G</strong>: The Initial Graph Structure</li>
                    <li><strong>d_g</strong>: Graph Dimensions</li>
                    <li><strong>d_a</strong>: Array Dimensions</li>
                    <li><strong>VC</strong>: Vertex of Colors (key being the nodeID and value being the color)</li>
                    <li><strong>W</strong>: Weights of Edges</li>
                    <li><strong>EC</strong>: Edge colors (key being the edgeID and value being the color)</li>
                </ul>
                <li>Edges are added using <code>AddEdge(node1, node2)</code> if the nodes don’t already have an edge.</li>
            </ul>
        ),
        filterText: (
            <ul>
            <li>Graph is filtered by NodeIDS through the in-built SNAP function <strong>GetSubGraph (node_ids)</strong></li>
            <ul>
                <li><strong>GetSubGraph</strong> extracts and creates a new Graph based on the NodeIDS and their edges provided by the graph(G).</li>
                <li>Example: <strong>subgraph = self.G.GetSubGraph (node_ids) </strong></li>
            </ul>
            </ul>
        ),
        bfsText: (
            <ul>
            <li>An interface, green vertex, is connected to the bottom boundary of the graph.</li>
            <ul>
                <li>Creates a <strong>Hash table (TIntH in SNAP) </strong> that will store parent nodes for each node visited during the BFS travel. The key will be the NodeID and the value will be its parent node.</li>
                <li>Performs BFS using <strong>self.G.GetBfsTree (source, True, False)</strong>, which performs BFS starting from the source node on the graph, G.</li>
                <li>Calculates the path from the source node to every other node and is stored in the Hashtable.</li>
                <li>Finds the path from the source node to the destination node using the Hash table.</li>
            </ul>
            </ul>
        ),
        graphCode: snapCode,
        filterCode: snapFiltering,
        bfsCode: snapBFS,
        github: "https://github.com/8michael8/GraSPI_SNAP/tree/master"
    },
    {
        img: igraph,
        text: "igraph is a collection of network analysis tools with the emphasis on efficiency, portability, and ease of use. igraph is open source and free. igraph can be programmed in R, Python, Mathematica, and C/C++.",
        header: "igraph",
        algoText: "Testing2",
        filterText: "CCCCCCCcc",
        bfsText: "3333333",
        github: "https://github.com/wenqizheng326/graspi_igraph",
        graphCode: igraphGraph,
        filterCode: igraphFilter,
        bfsCode: igraphBFS
    },
    {
        img: rustworkx,
        text: "rustworkx is a Python package for working with graphs and complex networks. It enables the creation, interaction with, and study of graphs and networks.",
        header: "rustworkx",
        algoText: "Testing3",
        filterText: "BBBBB",
        bfsText: "2222222222",
        github: "https://github.com/jzzhou03/material-microstructure-rustworkx",
        graphCode: rustGraph,
        filterCode: rustFilter,
        bfsCode: rustBFS
    },
    {
        img: graphtool,
        text: "Graph-tool is an efficient Python module for manipulation and statistical analysis of graphs (a.k.a. networks). Contrary to most other Python modules with similar functionality, the core data structures and algorithms are implemented in C++, making extensive use of template metaprogramming, based heavily on the Boost Graph Library. This confers it a level of performance that is comparable (both in memory usage and computation time) to that of a pure C/C++ library.",
        header: "graphtool",
        algoText: "Testing4",
        filterText: "AAAAAAAA",
        bfsText: "1111111"
    }
];


  return (
    <>

      <div className="homePage">
        <div className={`${loading ? 'loadingScreen' : 'loadingScreen2'}`}>
        <div class="l1"></div>
        <div class="l2"></div>
        <div class="l3"></div>
        <div class="l4"></div>
        <div class="l5"></div>
        <div class="l6"></div>
        <div class="l7"></div>
        <div class="l8"></div>
        <h1 className="loading"> LOADING </h1>
        </div>
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
                    {libraries.map((library, index) => (
            <div key={index} className={`lib ${library.header.toLowerCase()}`} onClick={() => libTransition(library)}>
                <a className = "githubIcon" href={library.github} target="_blank"><i class="fab fa-github"></i></a>
                <img src={library.img} alt={library.header} className="libPic"/>
            </div>
        ))}

                  <div class="circle2"></div>
      </div>
{isPopupVisible && (
    <div className="popup">
        {currentSlide === 'intro' && (
            <>
                <img src={popupContent.img} alt="" className="popup-img" />
                <h1 className="popup-h">{popupContent.header}</h1>
                <p className="popup-p">{popupContent.text}</p>
                <button className="next-button" onClick={() => setCurrentSlide('graph')}>
                     &#x2192;
                </button>
                <button className="prev-button" onClick={() => setCurrentSlide('bfs')}>
                     &#x2190;
                </button>
            </>
        )}
        {currentSlide === 'graph' && (
            <>
                <h1 className="popup-h">Graph Creation</h1>
                <p className="popup-algo">{popupContent.algorithmText}</p>
                <button
                className="next-button"
                onClick={() => {
                    setCurrentSlide('filter'); // Change to graph slide
                    setGeneratedImage(null);  // Reset generated image
                }}
            >
                     &#x2192;
                </button>
                <button className="prev-button" onClick={() => {
                    setCurrentSlide('intro'); // Change to graph slide
                    setGeneratedImage(null);  // Reset generated image
                }}>
                    &#x2190;
                </button>
                <button className="graphButton" onClick={() => graphCreation(popupContent.header, currentSlide)}>Generate Graph</button>
        <img
            src={popupContent.graphCode}
            alt=""
            className="popup-img2"
            style={{ opacity: generatedImage ? 0 : 1 }}
        />
            {generatedImage && (
                <img src={generatedImage} alt="Generated Graph" className="graphImage" />
            )}
            </>
        )}
        {currentSlide === 'filter' && (
            <>
                <h1 className="popup-h">Filtering</h1>
                <p className="popup-algo">{popupContent.filterText}</p>
                <button className="next-button" onClick={() => {
                    setCurrentSlide('bfs'); // Change to graph slide
                    setGeneratedImage(null);  // Reset generated image
                }}
            >
                    &#x2192;
                </button>
                <button className="prev-button" onClick={() => {
                    setCurrentSlide('graph'); // Change to graph slide
                    setGeneratedImage(null);  // Reset generated image
                }}
            >
                     &#x2190;
                </button>
                <button className="graphButton" onClick={() => graphCreation(popupContent.header, currentSlide)}>Generate Filter</button>
        <img
            src={popupContent.filterCode}
            alt=""
            className="popup-img2"
            style={{ opacity: generatedImage ? 0 : 1 }}
        />
            {generatedImage && (
                <img src={generatedImage} alt="Generated Graph" className="graphImage" />
            )}

            </>
        )}

        {currentSlide === 'bfs' && (
            <>
                <h1 className="popup-h">BFS</h1>
                <p className="popup-algo">{popupContent.bfsText}</p>
                <button className="next-button" onClick={() => {
                    setCurrentSlide('intro'); // Change to graph slide
                    setGeneratedImage(null);  // Reset generated image
                }}
            >
                    &#x2192;
                </button>
                <button className="prev-button" onClick={() => {
                    setCurrentSlide('filter'); // Change to graph slide
                    setGeneratedImage(null);  // Reset generated image
                }}
            >
                     &#x2190;
                </button>
                <button className="graphButton" onClick={() => graphCreation(popupContent.header, currentSlide)}>Generate Paths</button>
        <img
            src={popupContent.bfsCode}
            alt=""
            className="popup-img2"
            style={{ opacity: generatedImage ? 0 : 1 }}
         />
          {path && Object.keys(path).length > 0 && (
            <div className="bfsPath">
                <button onClick={downloadPathsAsText}>Download Paths as Text</button>
            </div>
        )}


            </>
        )}

        <button className="close" onClick={closePopup}>X</button>
    </div>
)}

    </>
  );
}

export default App;

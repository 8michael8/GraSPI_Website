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
import rustGraph from './images/rustworkxGraph.png'
import rustFilter from './images/rustworkxFilter.png'
import rustBFS from './images/rustworkxBFS.png'
import igraphGraph from './images/igraphGraph.png'
import igraphFilter from './images/igraphFilter.png'
import igraphBFS from './images/igraphBFS.png'
import gt_creation from './images/gt_creation.JPG'
import gt_filter from './images/gt_filter.JPG'
import gt_bfs from './images/gt_bfs.JPG'

function App() {
    const animation = gsap.timeline();
  useEffect(() => {
    window.scrollTo(0, 0);
      setTimeout(() => {
    document.body.classList.add('no-scroll');
  }, 1000);

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
        setPath({});
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
algoText: (
            <ul>
                <li>Graphs are generated using the <code>generateGraph(file)</code> which takes in a input file name. The function which uses igraph's built-in function <strong>igraph.Graph()</strong></li>
                <li>igraph.Graph takes in parameters:</li>
                <ul>
                    <li><strong>n</strong>: number of vertices</li>
                    <li><strong>edges</strong>: lists of edges</li>
                    <li><strong>directed</strong>: true or false if graph is directed</li>
                    <li><strong>vertex_attrs</strong>: list of vertex colors or attributes</li>
                </ul>
                <li>Edges are added using <strong>edge(file)</strong> within the generateGraph function</li>
                <li>The vertex attributes are generated via <strong>vertexColors(file)</strong></li>
            </ul>
        ),
        filterText: (
            <ul>
            <li>filterGraph(graph) filters a graph by using the in-built igraph function <strong>subgraph_edges(edgesList, delete_vertices)</strong></li>
            <ul>
                <li><strong>subgraph_edges(edgesList, delete_vertices)</strong> takes in the parameters: list of edges, if vertices get deleted delete_vertices takes true or false.</li>
                <li>Subgraphs are generated based on if the neighbors of the current vertex is the same color, then the connecting edge is kept, if not, it's removed. Thus, this filters the graph by having connected components where each subgraph is one color.</li>
                <li>Example: <strong>filtered_graph = filterGraph(graph) </strong></li>
                <li>    graph is a graph generated via igraph</li>
            </ul>
            </ul>
        ),
        bfsText: (
            <ul>
            <li>An interface, green vertex, is connected to the bottom boundary of the graph.</li>
            <ul>
                <li>Edges are added to the existing graph via <strong>graph.add_edges(edges)</strong></li>
                <li>The shortest path is determined between the green vertex and all the black vertices until the white vertices are reached via <strong>shortest_path(graph,file)</strong> which takes in a graph created by igraph</li>
                <li><strong>shortest_path(graph,file)</strong> utilizes igraph's built-in function <strong>graph.get_shortest_paths(start,end)</strong> which returns the path of vertices between start and end vertice</li>
            </ul>
            </ul>
        ),
        github: "https://github.com/wenqizheng326/graspi_igraph",
        graphCode: igraphGraph,
        filterCode: igraphFilter,
        bfsCode: igraphBFS
    },
    {
        img: rustworkx,
        text: "rustworkx is a Python package for working with graphs and complex networks. It enables the creation, interaction with, and study of graphs and networks.",
        header: "rustworkx",
         algoText: (
            <ul>
                <li>Graphs are generated using the <code>createGraph(filename, cathode)</code> function.</li>
                <li>Parameters:</li>
                <ul>
                    <li><strong>filename</strong>: The name of the file for input</li>
                    <li><strong>cathode</strong>: A boolean to determine if a cathode/interface node should be created
                    </li>
                </ul>
                <li>Nodes are added using <code>add_node(obj)</code></li>
                <ul>
                    <li><strong>obj</strong>: Inputs a custom node object that stores a label, color, x, y, z</li>
                </ul>
                <li>Edges are added using <code>add_edge(node_a, node_b, obj)</code>
                    <ul>
                        <li><strong>node_a</strong>: The parent node</li>
                        <li><strong>node_b</strong>: The child node</li>
                        <li><strong>obj</strong>: Inputs a custom edge object that stores the connecting node objects and
                            weight of the edge
                        </li>
                    </ul>
                </li>
                <li>A PyGraph object is returned of the created graph</li>
            </ul>
        ),
        filterText: (
            <ul>
            <li>Graph is filtered by the <code>filterGraph(g, visualize)</code> function</li>
                <li>Parameters:</li>
                <ul>
                    <li><strong>g</strong>: The graph that will be filtered</li>
                    <li><strong>visualize</strong>: A boolean to determine if a visualization is created</li>
                </ul>
                <li>Relies mainly on the built in function <code>filter_edges(filter_function)</code></li>
                <ul>
                    <li><strong>filter_function</strong>: A function that determines how edges will be filtered</li>
                    <li><code>connectedComponents</code> is the filtering function created to only select edges between
                        two nodes with the same color
                    </li>
                </ul>
                <li>Returns a PyGraph object of the filtered graph</li>
            </ul>
        ),
        bfsText: (
            <ul>
                <li>The shortest path is created by the <code>shortestPath(g)</code> function</li>
                <li>Parameters:</li>
                <ul>
                    <li><strong>g</strong>: The graph that the shortest path algorithm will be ran on</li>
                    <ul>
                        <li>This graph should be a filtered graph with a cathode node</li>
                    </ul>
                </ul>
                <li>Relies on the built in function <code>dijkstra_shortest_paths(g, cathode)</code></li>
                <ul>
                    <li><strong>g</strong>: The graph that the shortest path will be run on</li>
                    <ul>
                        <li>In this case, it is a filtered graph with a cathode</li>
                    </ul>
                    <li><strong>cathode</strong>: The starting node that will find paths to all other nodes</li>
                </ul>
                <li>Will return a dictionary of the shortest paths for each possible node</li>
            </ul>
        ),
        github: "https://github.com/jzzhou03/material-microstructure-rustworkx",
        graphCode: rustGraph,
        filterCode: rustFilter,
        bfsCode: rustBFS
    },
    {
        img: graphtool,
        text: "Graph-tool is an efficient Python module for manipulation and statistical analysis of graphs (a.k.a. networks). Contrary to most other Python modules with similar functionality, the core data structures and algorithms are implemented in C++, making extensive use of template metaprogramming, based heavily on the Boost Graph Library. This confers it a level of performance that is comparable (both in memory usage and computation time) to that of a pure C/C++ library.",
        header: "graphtool",
         algoText: (
            <ul>
                <li>Graphs are generated using the graph-tool function.</li>
                <li>Each number corresponds to a node index.</li>
                <li>Index 0 represents the bottom connection, and index 1 the top connection.</li>
                <li>This is a 10x10 structure, with every edge printed.</li>
            </ul>
        ),
        filterText: (
            <ul>
                <li>Graph is filtered by GraphView through the in-built graph-tool function.</li>
                <li>It is supported by two other functions, edge_filter and vertex_filter.</li>
                <li>These helper functions determine what is being excluded.</li>
                <li>The GraphView also helps create this filtered graph as an entirely new graph on its own.</li>
            </ul>
        ),
        bfsText: (
            <ul>
                <li>This BFS implementation starts at the bottom node, which is represented by 0. Graph-Tool uses an in-built function that uses a helper function called BFSVisitor. This helper function also determines what parameters to set when searching. The image here, represents all the paths from each node starting from node 0. It is doing this search on a filtered graph, so half of the nodes do not have a pathing.</li>
            </ul>
        ),
        github: "https://github.com/gobrin111/graph-tool-testing"
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
        <div className="mission">
            <p>Our mission is to identify the best Python-based package from the four options below and translate its functionality into a GraSPI implementation. </p>
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
                 {popupContent.header === "rustworkx" && (
                    <button className="graphButtonK" onClick={() => graphCreation("rustworkxK", currentSlide)}>Generate Graph (K)</button>
                 )}
{popupContent.header === "graphtool" ?
                    <img src={gt_creation} alt="" className="popup-img2" style={{opacity: generatedImage ? 0 : 1, width:500, left: 50}}/>
                    :
                    <img src={popupContent.graphCode} alt="" className="popup-img2" style={{opacity: generatedImage ? 0 : 1}}/>
                }
            {generatedImage && (
                <img src={generatedImage} alt="Generated Graph" className="graphImage" />
            )}
            </>
        )}
        {currentSlide === 'filter' && (
            <>
                <h1 className="popup-h">Filtering</h1>
                <p className="popup-algo">{popupContent.filterText}</p>
                 {popupContent.header === "graphtool" && <img src={gt_filter} alt="" className="popup-img2" style={{opacity: generatedImage ? 0 : 1, width:500, left: 50}}/>}
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
                 {popupContent.header === "rustworkx" && (
                    <button className="graphButtonK" onClick={() => graphCreation("rustworkxK", currentSlide)}>Generate Graph (K)</button>
                 )}
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
                {popupContent.header === "graphtool" && <img src={gt_bfs} alt="" className="popup-img2" style={{opacity: generatedImage ? 0 : 1, width:500, left: 50}}/>}
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
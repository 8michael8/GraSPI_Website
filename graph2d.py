import argparse
import snap
import os
from GraphDimensions import GraphDimensions
from ArrayDimensions import ArrayDimensions
from Filtering import Filtering
from BFS import BFS
os.environ["PATH"] += os.pathsep + 'C:/Program Files (x86)/Graphviz/bin'

#Vertex Colors, key being the vertex indices and value being the color
VC = {}
#Weights, key being the edges (from, to) and value being the weight
W = {}
#Edge Colors, key being the edge (from, to) and the value being the color
EC = {}
def parge_arguments():
    parser = argparse.ArgumentParser(description="Command Line for Graph Input")

    #Define Command-Line Arguments
    parser.add_argument("-a", "--array", type=str, help="Input Structured Graph File", required=True)
    parser.add_argument("-s", "--pixelsize", type=int, default=1, help="Pixel Size, default is 1")
    parser.add_argument("-p", "--periodic", type=int, default=0, choices=[0, 1], help="Periodic Faces, 0 is default (False)")
    parser.add_argument("-n", "--phases", type=int,default=2,choices=[2,3], help="Number of Phases (black and white, electron-donor and electron accepting material)")
    parser.add_argument("-r", "--path", type=str, default="./", help="Location of where to save file, default is ./")

    return parser.parse_args()

def read_array(filename, VC, d_a, d_g):
    try:
        with open(filename, 'r') as f:
            dimensions = f.readline().strip()
            dimensions = list(map(int, dimensions.split()))
            d_a.x, d_a.y, d_a.z = dimensions[0], dimensions[1], dimensions[2]

            if d_a.z == 0:
                d_a.z = 1

            d_g.n_bulk = d_a.x * d_a.y * d_a.z
            n_total = d_g.n_total()

            vertice = 0
            for line in f:
                row_colors = list(map(int, line.strip().split()))
                for color in row_colors:
                    VC[vertice] = color
                    vertice += 1
            VC[d_g.n_bulk] = 0 #Green Vertex
        #Success
        return True
    except FileNotFoundError:
        print(f"Error: File {filename} not found")
        return False
    except Exception as e:
        print(f"Error: {str(e)}")
        return False


def build_graph(G, d_g, d_a, VC, W, EC):
    """
    Builds the graph by connecting vertices based on their adjacency in a 3D grid.

    Parameters:
    G: SNAP graph
    d_g: Graph dimensions (contains n_bulk, n_total, etc.)
    d_a: Array dimensions (contains x, y, z)
    VC: Vertex colors (dict)
    W: Weights for edges (dict)
    EC: Edge colors (dict)
    """

    # Add vertices
    for node_id in range(len(VC)):
        G.AddNode(node_id)

    # Define directions for neighboring vertices (N, S, E, W for 2D)
    directions = [(dx, dy)
                  for dx in [-1, 0, 1]
                  for dy in [-1, 0, 1]
                  if not (dx == 0 and dy == 0)]  # Remove dz for 2D graph

    # Add edges between neighboring vertices
    for x in range(d_a.x):
        for y in range(d_a.y):
            # Current vertex index
            current_node = x * d_a.y + y  # 2D grid indexing

            # Check neighbors
            for dx, dy in directions:
                nx, ny = x + dx, y + dy

                if 0 <= nx < d_a.x and 0 <= ny < d_a.y:
                    neighbor_node = nx * d_a.y + ny

                    # Add an edge if it doesn't already exist
                    if not G.IsEdge(current_node, neighbor_node):
                        G.AddEdge(current_node, neighbor_node)
    for i in range(0,d_a.x):
        G.AddEdge(i, d_g.n_bulk)
    return G



'''
    # Optionally, set weights and edge colors (if they are provided)
    for edge in G.Edges():
        src, dst = edge.GetId()
        W[(src, dst)] = 1  # Default weight (change as needed)
        EC[(src, dst)] = "black"  # Default color (change as needed)
'''

def print_adjacency_list(G):
    print("Adjacency List:")
    for node in G.Nodes():
        neighbors = [str(neighbor_id) for neighbor_id in node.GetOutEdges()]
        print(f"Node {node.GetId()}: {' '.join(neighbors)}")

def visualize_graph(G, output_file):
    """
    Generates a visual representation of the graph using SNAP's DrawGViz.

    Parameters:
    G: SNAP graph
    output_file: Filename for the output image (PNG, SVG, etc.)
    """
    # Define the layout for the visualization
    Layout = snap.gvlSfdp  # You can also try gvlNeato, gvlTwopi, gvlSfdp, gvlCirco

    # Draw the graph using the specified layout
    snap.DrawGViz(G, Layout, output_file, "Graph Visualization", True)


def runSnap(type):
    d_g = GraphDimensions()
    d_a = ArrayDimensions()
    file = "./testCases/10x10.txt"
    VC = {}
    output_file = f"frontend/client/src/graph/snap{type}.png"
    print("Generating Graph...")
    if read_array(file, VC, d_a, d_g):
        G = snap.TUNGraph.New()
        G = build_graph(G, d_g, d_a, VC, W, EC)

        # Visualize the graph
        if type == "graph":
            visualize_graph(G, output_file)
            return 0
        elif type == "filter":
            filteredGraph = Filtering(G,VC)
            SubGraph = filteredGraph.filter()
            visualize_graph(SubGraph[0], output_file)
            return 0
        elif type == "bfs":
            paths = {}
            filteredGraph = Filtering(G, VC)
            SubGraph = filteredGraph.filter()
            for node in SubGraph[0].Nodes():
                bfs = BFS(SubGraph[0], node.GetId(), d_g.n_bulk)
                path = bfs.bfs()
                if path and path[0] == bfs.source:
                    paths[node.GetId()] = path
                else:
                    paths[node.GetId()] = d_g.n_bulk
            return paths
    return 0

def main():
    args = parge_arguments()

    if args.array:
        infileFlag = 0
        file = args.array
        pixelSize = args.pixelsize
        periodic = args.periodic
        phases = args.phases
        path = args.path

    print(f"Flag: {infileFlag}")
    print(f"Input file: {file}")
    print(f"Pixel size: {pixelSize}")
    print(f"Periodic phase: {periodic}")
    print(f"Phases: {phases}")
    print(f"File path: {path}")

    d_g = GraphDimensions()
    d_a = ArrayDimensions()



    if read_array(file, VC, d_a, d_g):

        G = snap.TUNGraph.New()
        G = build_graph(G, d_g, d_a, VC, W, EC)
        # Visualize the graph
        output_file = "output/graph.png"
        visualize_graph(G, output_file)



    filteredGraph = Filtering(G, VC)
    SubGraph = filteredGraph.filter()

    outputBlack = "output/filteredBlack.png"
    outputWhite = "output/filteredWhite.png"


    for graph in SubGraph:
        if graph == 0:
            visualize_graph(SubGraph[graph], outputBlack)
        else:
            visualize_graph(SubGraph[graph], outputWhite)

    paths = {}
    print("Edges:")
    for node in SubGraph[0].Nodes():
        bfs = BFS(SubGraph[0], node.GetId(), d_g.n_bulk)
        path = bfs.bfs()
        if path and path[0] == bfs.source:
            paths[node.GetId()] = path
            #print(f"NodeID: {node.GetId()}\n {path}")
        else:
            paths[node.GetId()] = d_g.n_bulk
            print("No path found")



if __name__ == "__main__":
    main()
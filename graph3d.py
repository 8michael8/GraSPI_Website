import argparse
import snap
import time
import os
from GraphDimensions import GraphDimensions
from ArrayDimensions import ArrayDimensions
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
            print(f"nTotal: {n_total}")

            vertice = 0
            for line in f:
                row_colors = list(map(int, line.strip().split()))
                for color in row_colors:
                    VC[vertice] = color
                    vertice += 1
        #Success
        return True
    except FileNotFoundError:
        print(f"Error: File {filename} not found")
        return False
    except Exception as e:
        print(f"Error: {str(e)}")
        return False


def build_graph(G, d_g, d_a, VC, W, EC):
    start = time.time()
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

    # Define directions for neighboring vertices (N, S, E, W, U, D for 3D)
    directions = [(dx, dy, dz)
                  for dx in [-1, 0, 1]
                  for dy in [-1, 0, 1]
                  for dz in [-1, 0, 1]
                  if not (dx == 0 and dy == 0 and dz == 0)]

    # Add edges between neighboring vertices
    for x in range(d_a.x):
        for y in range(d_a.y):
            for z in range(d_a.z):
                # Current vertex index
                current_node = x * d_a.y * d_a.z + y * d_a.z + z

                # Check neighbors
                for dx, dy, dz in directions:
                    nx, ny, nz = x + dx, y + dy, z + dz

                    if 0 <= nx < d_a.x and 0 <= ny < d_a.y and 0 <= nz < d_a.z:
                        neighbor_node = nx * d_a.y * d_a.z + ny * d_a.z + nz

                        # Add an edge if it doesn't already exist
                        if not G.IsEdge(current_node, neighbor_node):
                            G.AddEdge(current_node, neighbor_node)
    print(time.time()-start)
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
    Layout = snap.gvlNeato  # You can also try gvlNeato, gvlTwopi, gvlSfdp, gvlCirco

    # Draw the graph using the specified layout
    start = time.time()
    snap.DrawGViz(G, Layout, output_file, "Graph Visualization", True)
    print(f"Visualization time: {time.time()-start}")
    print(f"Graph visualization saved to {output_file}")
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
        print("Array successfully read.")

        # Create the graph
        G = snap.TUNGraph.New()
        G = build_graph(G, d_g, d_a, VC, W, EC)
        # Visualize the graph
        output_file = "output/graph.png"
        visualize_graph(G, output_file)

if __name__ == "__main__":
    main()
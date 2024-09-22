from flask import Flask, send_from_directory, jsonify
import os
#SNAP
from graph2d import runSnap
from graph2dIGraph import runIgraph

app = Flask(__name__, static_folder='frontend/client/build', static_url_path='/')


@app.route('/create/<library_name>/<graph_type>', methods=['POST'])
def create_graph(library_name, graph_type):
    # Initialize variables
    path = None
    image_path = None
    if library_name == "snap":
        if graph_type == 'bfs':
            path = runSnap(graph_type)
        else:
            runSnap(graph_type)
    elif library_name == "igraph":
        runIgraph(graph_type)

    if path:
        return jsonify({'path': path})

    image_path = os.path.join('frontend/client/src/graph', f'{library_name}{graph_type}.png')
    return jsonify({'image_path': f'/static/{library_name}{graph_type}.png'})


@app.route('/static/<filename>')
def serve_image(filename):
    return send_from_directory('frontend/client/src/graph', filename)


@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve(path):
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(app.static_folder, "index.html")

if __name__ == "__main__":
    app.run(debug=True)

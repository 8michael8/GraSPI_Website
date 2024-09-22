class Filtering:
    def __init__(self, G, VC):
        self.G = G
        self.VC = VC

    def filter(self):
        color_groups = {}

        for node_id, color in self.VC.items():
            if color not in color_groups:
                color_groups[color] = []
            color_groups[color].append(node_id)

        subgraphs = {}
        for color, node_ids in color_groups.items():
            subgraph = self.G.GetSubGraph(node_ids)
            subgraphs[color] = subgraph

        return subgraphs  # Return subgraphs for each color
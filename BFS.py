import snap


class BFS:
    def __init__(self, G, source, destination):
        self.G = G
        self.source = source
        self.destination = destination

    def bfs(self):
        parentNodes = snap.TIntH()
        parentNodes[self.source] = -1
        bfsTree = self.G.GetBfsTree(self.source, True, False)

        for edge in bfsTree.Edges():
            parentNodes[edge.GetDstNId()] = edge.GetSrcNId()


        path = []
        currentNode = self.destination
        while currentNode != -1:
            path.append(currentNode)
            if currentNode in parentNodes:
                currentNode = parentNodes[currentNode]
            else:
                currentNode = -1

        path.reverse()

        return path
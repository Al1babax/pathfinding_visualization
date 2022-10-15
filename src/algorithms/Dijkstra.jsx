export function Dijkstra(props) {
    const { grid, startNode, endNode } = props;
    const visitedNodesInOrder = [];
    startNode.distance = 0;
    const unvisitedNodes = [];
    let searchedNodesInOrder = [];
    //TODO: make dijkstra algorithm
    let currentNode = startNode;

    function getUnvisitedNeighbors(node) {
        // add neighbors to array if they are not visited and not a wall in order of up, right, down, left
        let neighbors = [];
        const nodeIndex = node.id
        if (nodeIndex - 1 >= 0 && !grid[nodeIndex - 1].isVisited && !grid[nodeIndex - 1].isWall && !grid[nodeIndex - 1].onSearch && !grid[nodeIndex].isTopNode) {
            neighbors.push(grid[nodeIndex - 1]);
        }
        if (nodeIndex + 20 < grid.length && !grid[nodeIndex + 20].isVisited && !grid[nodeIndex + 20].isWall && !grid[nodeIndex + 20].onSearch && !grid[nodeIndex].isRightNode) {
            neighbors.push(grid[nodeIndex + 20]);
        }
        if (nodeIndex + 1 < grid.length && !grid[nodeIndex + 1].isVisited && !grid[nodeIndex + 1].isWall && !grid[nodeIndex + 1].onSearch && !grid[nodeIndex].isBottomNode) {
            neighbors.push(grid[nodeIndex + 1]);
        }
        if (nodeIndex - 20 >= 0 && !grid[nodeIndex - 20].isVisited && !grid[nodeIndex - 20].isWall && !grid[nodeIndex - 20].onSearch && !grid[nodeIndex].isLeftNode) {
            neighbors.push(grid[nodeIndex - 20]);
        }
        // setup neighbors distance, previous node, and add to visited nodes
        neighbors.map(neighbor => {
            neighbor.previousNode = node.id
            neighbor.onSearch = true
            neighbor.distance = node.distance + 1
            searchedNodesInOrder.push(neighbor)
        })
        return neighbors
    }

    function sortNodesByDistance(unvisitedNodes) {
        unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
    }

    let unvisitedNeighbors = getUnvisitedNeighbors(currentNode);
    unvisitedNodes.push(...unvisitedNeighbors);

    let counter = 0
    let secondToLastNode = null
    while (unvisitedNodes.length > 0 | counter > 1000) {
        sortNodesByDistance(unvisitedNodes);
        //console.log(visitedNodesInOrder)
        secondToLastNode = currentNode
        currentNode = unvisitedNodes.shift(); 
        //currentNode.isVisited = true;
        if (currentNode === endNode) {
            currentNode.previousNode = secondToLastNode.id
        }
        visitedNodesInOrder.push(currentNode);
        if (currentNode === endNode) {
            return { visitedNodesInOrder, searchedNodesInOrder };
        }
        const unvisitedNeighbors = getUnvisitedNeighbors(currentNode);
        for (const neighbor of unvisitedNeighbors) {
            unvisitedNodes.push(neighbor);
        }
        counter += 1
    }
    return { visitedNodesInOrder, searchedNodesInOrder };
}
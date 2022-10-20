export function Dijkstra(props) {
    const { grid, startNode, endNode } = props;
    const visitedNodesInOrder = [];
    const unvisitedNodes = [];
    let searchedNodesInOrder = [];


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
        })
        searchedNodesInOrder.push(neighbors)
        return neighbors
    }

    function sortNodesByDistance(unvisitedNodes) {
        unvisitedNodes.sort((nodeA, nodeB) => nodeA.distance - nodeB.distance);
    }

    // setup first node here
    startNode.distance = 0;
    let currentNode = startNode;
    let unvisitedNeighbors = getUnvisitedNeighbors(currentNode);
    unvisitedNodes.push(...unvisitedNeighbors);
    visitedNodesInOrder.push(currentNode);

    let counter = 0 // failsafe
    while (unvisitedNodes.length > 0 | counter > 1000) {
        sortNodesByDistance(unvisitedNodes);
        //console.log(visitedNodesInOrder)
        currentNode = unvisitedNodes.shift();
        currentNode.isVisited = true;
        const unvisitedNeighbors = getUnvisitedNeighbors(currentNode);
        if (unvisitedNeighbors.includes(endNode)) { // check if endNode is within the unvisited neighbors
            endNode.previousNode = currentNode.id
            visitedNodesInOrder.push(endNode)
            break;
        }
        visitedNodesInOrder.push(currentNode);
        for (const neighbor of unvisitedNeighbors) {
            unvisitedNodes.push(neighbor);
        }
        counter += 1
    }
    // I had to setup all nodes visited or onsearch to false to get my animation function working
    for (const node of visitedNodesInOrder) {
        node.isVisited = false
        node.onSearch = false
    }
    for (let i = 0; i < searchedNodesInOrder.length; i++) {
        for (let j = 0; j < searchedNodesInOrder[i].length; j++) {
            searchedNodesInOrder[i][j].onSearch = false
            searchedNodesInOrder[i][j].isVisited = false
        }
    }

    // Get the shortest path
    const shortestPathInOrder = [];
    let currentNode2 = endNode;
    while (currentNode2 !== startNode) {
        currentNode2 = grid[currentNode2.previousNode];
        shortestPathInOrder.push(currentNode2);
    }

    return { visitedNodesInOrder, shortestPathInOrder, searchedNodesInOrder };
}
export function Astar(props, distanceMeasurement) {
    const { grid, startNode, endNode } = props;

    // Initialize new copy of the newGrid
    const newGrid = [];
    for (let i = 0; i < grid.length; i++) {
        newGrid.push(grid[i]);
    }

    // Calculate the heuristic distance between two nodes using Manhattan distance
    const heuristic = (node1, node2) => {
        let node1_row = node1.id % 20;
        let node1_col = Math.floor(node1.id / 20);
        let node2_row = node2.id % 20;
        let node2_col = Math.floor(node2.id / 20);
        // Manhattan distance
        const manhattanDistance = Math.abs(node1_row - node2_row) + Math.abs(node1_col - node2_col);
        // Euclidean distance
        const euclideanDistance = Math.sqrt(Math.pow(node1_row - node2_row, 2) + Math.pow(node1_col - node2_col, 2));
        // return euclideanDistance;
        if (distanceMeasurement === "Manhattan") {
            return manhattanDistance;
        } else if (distanceMeasurement === "Euclidean") {
            return euclideanDistance;
        }
    }

    // Initialize arrays for animation
    const visitedNodesInOrder = [];
    const shortestPathInOrder = [];
    const onSearchNodesInOrder = [];


    function getUnvisitedNeighbors(node) {
        // add neighbors to array if they are not visited and not a wall in order of up, right, down, left
        let neighbors = [];
        const nodeIndex = node.id
        if (!newGrid[nodeIndex].isTopNode && !newGrid[nodeIndex - 1].isVisited && !newGrid[nodeIndex - 1].isWall && !newGrid[nodeIndex - 1].onSearch) {
            neighbors.push(newGrid[nodeIndex - 1]);
        }
        if (!newGrid[nodeIndex].isRightNode && !newGrid[nodeIndex + 20].isVisited && !newGrid[nodeIndex + 20].isWall && !newGrid[nodeIndex + 20].onSearch) {
            neighbors.push(newGrid[nodeIndex + 20]);
        }
        if (!newGrid[nodeIndex].isBottomNode && !newGrid[nodeIndex + 1].isVisited && !newGrid[nodeIndex + 1].isWall && !newGrid[nodeIndex + 1].onSearch) {
            neighbors.push(newGrid[nodeIndex + 1]);
        }
        if (!newGrid[nodeIndex].isLeftNode && !newGrid[nodeIndex - 20].isVisited && !newGrid[nodeIndex - 20].isWall && !newGrid[nodeIndex - 20].onSearch) {
            neighbors.push(newGrid[nodeIndex - 20]);
        }

        // setup neighbors distance, previous node, and add to visited nodes
        neighbors.map(neighbor => {
            neighbor.previousNode = node.id
            neighbor.onSearch = true
            neighbor.distance = node.distance + 1 + (neighbor.isWeight ? 5 : 0)
            neighbor.totalDistance = neighbor.distance + heuristic(neighbor, endNode) // custom weight added to distance to account for heuristic
        })
        onSearchNodesInOrder.push(neighbors)
        return neighbors
    }


    // Initialize the start node's distance to 0 and heurestic distance to the end node
    startNode.distance = 0;
    startNode.totalDistance = heuristic(startNode, endNode);

    // Initialize the queue with the start node
    let queue = [];
    queue.push(startNode);

    // Initialize the current node
    let currentNode = null;

    // While the queue is not empty
    while (queue.length > 0) {
        // Sort the queue by total distance in ascending order
        queue.sort((node1, node2) => node1.totalDistance - node2.totalDistance);

        // Get the node with the lowest total distance
        currentNode = queue.shift();

        currentNode.isVisited = true;
        visitedNodesInOrder.push(currentNode);

        // If the current node is the end node, break the loop
        if (currentNode === endNode) {
            endNode.isVisited = true;
            shortestPathInOrder.push(currentNode);
            break;
        }

        // Get the unvisited neighbors of the current node
        const unvisitedNeighbors = getUnvisitedNeighbors(currentNode);

        // Add the unvisited neighbors to the queue
        for (let i = 0; i < unvisitedNeighbors.length; i++) {
            queue.push(unvisitedNeighbors[i]);
        }
    }

    // If the end node is not visited, return null
    if (!endNode.isVisited) {
        return null;
    }

    // Get the shortest path
    let currentNode2 = endNode;
    while (currentNode2 !== startNode) {
        currentNode2 = newGrid[currentNode2.previousNode];
        shortestPathInOrder.push(currentNode2);
    }

    // remove isVisited and onSearch from all nodes in the grid for the animation to work
    for (let i = 0; i < newGrid.length; i++) {
        newGrid[i].isVisited = false;
        newGrid[i].onSearch = false;
    }

    // Return the visited nodes, shortest path, and nodes on search
    return { visitedNodesInOrder, shortestPathInOrder, onSearchNodesInOrder };
}
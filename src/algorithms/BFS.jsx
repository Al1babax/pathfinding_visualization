export function BFS(props) {
    const { grid, startNode, endNode } = props;
    

    // Initialize arrays for animation
    const visitedNodesInOrder = [];
    const shortestPathInOrder = [];
    const onSearchNodesInOrder = [];

    // Initialize the queue with the start node
    let queue = [];
    queue.push(startNode);

    function getUnvisitedNeighbors(node) {
        // add neighbors to array if they are not visited and not a wall in order of up, right, down, left
        let neighbors = [];
        const nodeIndex = node.id
        if (!grid[nodeIndex].isTopNode && !grid[nodeIndex - 1].isVisited && !grid[nodeIndex - 1].isWall && !grid[nodeIndex - 1].onSearch) {
            neighbors.push(grid[nodeIndex - 1]);
        }
        if (!grid[nodeIndex].isRightNode && !grid[nodeIndex + 20].isVisited && !grid[nodeIndex + 20].isWall && !grid[nodeIndex + 20].onSearch) {
            neighbors.push(grid[nodeIndex + 20]);
        }
        if (!grid[nodeIndex].isBottomNode && !grid[nodeIndex + 1].isVisited && !grid[nodeIndex + 1].isWall && !grid[nodeIndex + 1].onSearch) {
            neighbors.push(grid[nodeIndex + 1]);
        }
        if (!grid[nodeIndex].isLeftNode && !grid[nodeIndex - 20].isVisited && !grid[nodeIndex - 20].isWall && !grid[nodeIndex - 20].onSearch) {
            neighbors.push(grid[nodeIndex - 20]);
        }

        // setup neighbors distance, previous node, and add to visited nodes
        neighbors.map(neighbor => {
            neighbor.previousNode = node.id
            neighbor.onSearch = true
        })
        onSearchNodesInOrder.push(neighbors)
        return neighbors
    }

    while (queue.length > 0) {
        // get the first node in the queue
        let currentNode = queue.shift();
        // if the node is the end node, break out of the loop
        if (currentNode === endNode) {
            break;
        }
        currentNode.isVisited = true;
        visitedNodesInOrder.push(currentNode);
        let neighbors = getUnvisitedNeighbors(currentNode);
        // add the neighbors to the queue
        neighbors.map(neighbor => {
            queue.push(neighbor);
        })
    }

    // Get the shortest path
    let currentNode = endNode;
    while (currentNode !== undefined) {
        shortestPathInOrder.unshift(currentNode);
        currentNode = grid[currentNode.previousNode];
    }

    // remove isVisited and onSearch from all nodes in the grid for the animation to work
    for (let i = 0; i < grid.length; i++) {
        grid[i].isVisited = false;
        grid[i].onSearch = false;
    }

    return {visitedNodesInOrder, shortestPathInOrder, onSearchNodesInOrder};
}
export function DFS(props) {
    const { grid, startNode, endNode } = props;
    const visitedNodesInOrder = []; // visited nodes in order for animation
    const searchedNodesInOrder = []; // searched nodes in order for animation

    let algoDone = false; // flag to check if algorithm is done

    const stack = []; // all nodes that are going to be visited in order. Last node is the next node to be visited.
    stack.push(startNode); // push start node to stack
    visitedNodesInOrder.push(startNode); // push start node to visited nodes

    function addNodesToStack(node) {
        // add nodes in order of top, right, bottom, left
        // need to check if node is valid first (not a wall, not visited, not out of bounds)
        let neighbors = [];
        if (!node.isTopNode && !grid[node.id - 1].isWall && visitedNodesInOrder.find(element => element.id === node.id - 1) === undefined && stack.find(element => element.id === node.id - 1) === undefined) {
            stack.push(grid[node.id - 1]);
            neighbors.push(grid[node.id - 1]);
        }
        if (!node.isRightNode && !grid[node.id + 20].isWall && visitedNodesInOrder.find(element => element.id === node.id + 20) === undefined && stack.find(element => element.id === node.id + 20) === undefined) {
            stack.push(grid[node.id + 20]);
            neighbors.push(grid[node.id + 20]);
        }
        if (!node.isBottomNode && !grid[node.id + 1].isWall && visitedNodesInOrder.find(element => element.id === node.id + 1) === undefined && stack.find(element => element.id === node.id + 1) === undefined) {
            stack.push(grid[node.id + 1]);
            neighbors.push(grid[node.id + 1]);
        }
        if (!node.isLeftNode && !grid[node.id - 20].isWall && visitedNodesInOrder.find(element => element.id === node.id - 20) === undefined && stack.find(element => element.id === node.id - 20) === undefined) {
            stack.push(grid[node.id - 20]);
            neighbors.push(grid[node.id - 20]);
        }
        // setup neighbors distance, previous node, and add to visited nodes
        neighbors.map(neighbor => {
            neighbor.previousNode = node.id
            neighbor.onSearch = true
        })
        searchedNodesInOrder.push(neighbors)
        return neighbors
    }

    function checkIfNodeIsEnd() {
        // check if end node is in searched nodes array
        for (let i = 0; i < searchedNodesInOrder.length; i++) {
            if (searchedNodesInOrder[i].find(element => element.id === endNode.id) !== undefined) {
                return true
            }
        }
    }

    let failSafeCounter = 0;
    let currentNode = null;
    let prevNode = null;

    while (!algoDone) {
        if (failSafeCounter > 10000) {
            console.log("fail safe counter triggered");
            break;
        }
        if (stack.length === 0) {
            // if stack is empty, algo is done
            algoDone = true;
            break;
        }

        currentNode = stack.pop();
        prevNode = currentNode;
        visitedNodesInOrder.push(currentNode); // push current node to visited nodes

        addNodesToStack(currentNode); // add new nodes to stack around current node

        //searchedNodesInOrder = []; // reset new nodes to search
        failSafeCounter++;

        if (checkIfNodeIsEnd()) {
            // check if end node is in searched nodes array
            console.log("end node found");
            endNode.previousNode = prevNode.id;
            break;
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
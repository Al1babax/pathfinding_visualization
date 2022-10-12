export function DFS(props) {
    const { grid, startNode, endNode } = props;
    const visitedNodesInOrder = []; // visited nodes in order for animation
    let searchedNodesInOrder = []; // searched nodes in order for animation

    let algoDone = false; // flag to check if algorithm is done

    const stack = []; // all nodes that are going to be visited in order. Last node is the next node to be visited.
    stack.push(startNode); // push start node to stack
    visitedNodesInOrder.push(startNode); // push start node to visited nodes

    function addNodesToStack(node) {
        // add nodes in order of top, right, bottom, left
        // need to check if node is valid first (not a wall, not visited, not out of bounds)
        if (!node.isTopNode && !grid[node.id - 1].isWall && visitedNodesInOrder.find(element => element.id === node.id - 1) === undefined && stack.find(element => element.id === node.id - 1) === undefined) {
            stack.push(grid[node.id - 1]);
            searchedNodesInOrder.push(grid[node.id - 1]);
        }
        if (!node.isRightNode && !grid[node.id + 20].isWall && visitedNodesInOrder.find(element => element.id === node.id + 20) === undefined && stack.find(element => element.id === node.id + 20) === undefined) {
            stack.push(grid[node.id + 20]);
            searchedNodesInOrder.push(grid[node.id + 20]);
        }
        if (!node.isBottomNode && !grid[node.id + 1].isWall && visitedNodesInOrder.find(element => element.id === node.id + 1) === undefined && stack.find(element => element.id === node.id + 1) === undefined) {
            stack.push(grid[node.id + 1]);
            searchedNodesInOrder.push(grid[node.id + 1]);
        }
        if (!node.isLeftNode && !grid[node.id - 20].isWall && visitedNodesInOrder.find(element => element.id === node.id - 20) === undefined && stack.find(element => element.id === node.id - 20) === undefined) {
            stack.push(grid[node.id - 20]);
            searchedNodesInOrder.push(grid[node.id - 20]);
        }
    }

    function checkIfNodeIsEnd(node) {
        if (node.id === endNode.id) {
            return true;
        }
        return false;
    }

    let failSafeCounter = 0;
    let currentNode = [];
    let prevNode = [];

    while (!algoDone) {
        console.log(failSafeCounter);
        if (failSafeCounter > 10000) {
            console.log("fail safe counter triggered");
            break;
        }
        if (stack.length === 0) {
            // if stack is empty, algo is done
            algoDone = true;
            break;
        }
        if (visitedNodesInOrder.length === 1) {
            currentNode = stack.pop();
            //currentNode = stack.shift();
        } else {
            prevNode = currentNode;
            currentNode = stack.pop(); // get last node in stack
            //currentNode = stack.shift();
            grid[currentNode.id].previousNode = prevNode; // set previous node of current node
        }

        algoDone = checkIfNodeIsEnd(currentNode);
        if (algoDone) {
            endNode.previousNode = prevNode;
            break;
        }


        addNodesToStack(currentNode); // add new nodes to stack around current node
        visitedNodesInOrder.push({
            ...currentNode,
            "currentStack": searchedNodesInOrder,
        }); // push current node to visited nodes
        searchedNodesInOrder = []; // reset new nodes to search
        failSafeCounter++;
    }

    let nodesInShortestPathOrder = [...visitedNodesInOrder].reverse(); // nodes in shortest path for animation

    return { visitedNodesInOrder, nodesInShortestPathOrder, searchedNodesInOrder };
}
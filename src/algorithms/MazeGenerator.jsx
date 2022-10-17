export function MazeGenerator(Grid) {
    // Create a new grid
    const newGrid = Grid.slice();

    // setup isVisited array for animation
    const visitedInOrder = [];

    // initialize the newGrid
    for (let i = 0; i < newGrid.length; i++) {
        newGrid[i].isWall = false;
        newGrid[i].isVisited = false;
    }

    // initialize the newGrid with walls
    for (let i = 0; i < newGrid.length; i++) {
        newGrid[i].isWall = true;
    }

    function checkWalls(node){
        let walls = 0;
        if (node.isTopNode | (!node.isTopNode && newGrid[node.id - 1].isWall)){
            walls++;
        }
        if (node.isBottomNode | (!node.isBottomNode && newGrid[node.id + 1].isWall)){
            walls++;
        }
        if (node.isLeftNode | (!node.isLeftNode && newGrid[node.id - 20].isWall)){
            walls++;
        }
        if (node.isRightNode | (!node.isRightNode && newGrid[node.id + 20].isWall)){
            walls++;
        }
        return walls;
    }

    function getNeighbors(node) {
        const neighbours = [];
        // get the neighbors of a node
        if ((!node.isTopNode) && !newGrid[node.id - 1].isVisited) {
            if (checkWalls(newGrid[node.id - 1]) === 3){
                neighbours.push(newGrid[node.id - 1]);
            }
        }
        if ((!node.isRightNode) && !newGrid[node.id + 20].isVisited) {
            if (checkWalls(newGrid[node.id + 20]) === 3){
                neighbours.push(newGrid[node.id + 20]);
            }
        }
        if ((!node.isBottomNode) && !newGrid[node.id + 1].isVisited) {
            if (checkWalls(newGrid[node.id + 1]) === 3){
                neighbours.push(newGrid[node.id + 1]);
            }
        }
        if ((!node.isLeftNode) && !newGrid[node.id - 20].isVisited) {
            if (checkWalls(newGrid[node.id - 20]) === 3){
                neighbours.push(newGrid[node.id - 20]);
            }
        }
        return neighbours;
    }

    function removeWall(node) {
        // remove the wall between two nodes
        newGrid[node.id].isWall = false;
        newGrid[node.id].isVisited = true;
        visitedInOrder.push(node);
    }


    // initialize the visitedNodes
    const start = newGrid[0];
    start.isVisited = true;
    start.isWall = false;
    visitedInOrder.push(start);

    // initialize the maze
    const maze = [];
    maze.push(start);

    // while there are still unvisited nodes in the maze
    let counter = 0;
    while (maze.length > 0) {
        // choose random neighbour of a random node in the maze
        let randomNode = maze[Math.floor(Math.random() * maze.length)];
        let neighbours = getNeighbors(randomNode);
        let randomNeighbour = neighbours[Math.floor(Math.random() * neighbours.length)];
        if (randomNeighbour === undefined) {
            // remove random node from the maze and continue
            maze.splice(maze.indexOf(randomNode), 1);
            continue;
        }

        // if the random neighbour is not visited
        if (!randomNeighbour.isVisited) {
            // remove the wall between the random node and the random neighbour
            removeWall(randomNeighbour);
            // add the random neighbour to the maze
            maze.push(randomNeighbour);
        }
        // if the random neighbour is visited
        else {
            // remove the random node from the maze
            maze.splice(maze.indexOf(randomNode), 1);
        }

        counter ++;
    }


    //remove all visited nodes
    for (let i = 0; i < newGrid.length; i++) {
        newGrid[i].isVisited = false;
    }

    return visitedInOrder;

}
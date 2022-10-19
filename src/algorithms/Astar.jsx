export function Astar(props){
    const { grid, startNode, endNode } = props;

    // Initialize new copy of the grid
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
        return Math.abs(node1_row - node2_row) + Math.abs(node1_col - node2_col);
    }

    // Initialize the open and closed lists
    


}
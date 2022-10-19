import { useState, useEffect } from 'react';
import dropdownImage from "../recources/dropdown.png";
import { DFS } from "../algorithms/DFS";
import { BFS } from "../algorithms/BFS";
import { Dijkstra } from "../algorithms/Dijkstra";
import { Astar } from "../algorithms/Astar";
import { MazeGenerator } from "../algorithms/MazeGenerator";

export function Home() {

    const [grid, setGrid] = useState([]);
    const [mouseIsPressed, setMouseIsPressed] = useState(false);
    const [selectMode, setSelectMode] = useState("start");
    const [startNode, setStartNode] = useState(null);
    const [endNode, setEndNode] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [isPathFound, setIsPathFound] = useState(false);
    const [isPathFinding, setIsPathFinding] = useState(false);
    const [algorithm, setAlgorithm] = useState("Choose algorithm");
    const [speed, setSpeed] = useState(5);
    const [dropdonwOpen, setDropdownOpen] = useState(false);
    const [dropdownSpeedOpen, setDropdownSpeedOpen] = useState(false);


    function createGrid() {
        const grid = [];
        for (let i = 0; i < 1000; i++) {
            grid.push(
                {
                    id: i,
                    isStart: false,
                    isEnd: false,
                    isWall: false,
                    isVisited: false,   // nodes that algorithm has visited
                    onSearch: false, // nodes that algo will search next
                    isPath: false,  // final path when algo is done
                    isWeight: false,
                    weight: 1,
                    previousNode: null,
                    distance: Infinity,
                    totalDistance: Infinity, // for Astar
                    color: "bg-white",
                    isTopNode: i % 20 === 0 ? true : false,
                    isBottomNode: i % 20 === 19 ? true : false,
                    isLeftNode: i < 20 ? true : false,
                    isRightNode: i > 979 ? true : false,
                }
            )
        }
        setGrid(grid);
    }


    function reset() {
        const newGrid = grid.slice();
        for (let i = 0; i < newGrid.length; i++) {
            newGrid[i].isWall = false;
            newGrid[i].isVisited = false;
            newGrid[i].isPath = false;
            newGrid[i].onSearch = false;
            newGrid[i].previousNode = null;
            newGrid[i].distance = Infinity;
            newGrid[i].color = "bg-white";
            newGrid[i].isStart = false;
            newGrid[i].isEnd = false;
        }
        setGrid(newGrid);
        setIsRunning(false);
        setIsPathFound(false);
        setIsPathFinding(false);
        updateGrid();
    }


    function handleMouseDown(id) {
        setMouseIsPressed(true);
        const newGrid = [...grid];
        const node = newGrid[id];
        if (selectMode === "start" && !node.isEnd && !node.isWall) {
            if (startNode === null) {
                node.isStart = true;
                node.color = "bg-green-500";
                setStartNode(node);
            } else if (startNode.id !== node.id) {
                newGrid[startNode.id].isStart = false;
                newGrid[startNode.id].color = "bg-white";
                node.isStart = true;
                node.color = "bg-green-500";
                setStartNode(node);
            } else if (startNode.id === node.id) {
                node.isStart = false;
                node.color = "bg-white";
                setStartNode(null);
            }
        } else if (selectMode === "end" && !node.isStart && !node.isWall) {
            if (endNode === null) {
                node.isEnd = true;
                node.color = "bg-red-500";
                setEndNode(node);
            } else if (endNode.id !== node.id) {
                newGrid[endNode.id].isEnd = false;
                newGrid[endNode.id].color = "bg-white";
                node.isEnd = true;
                node.color = "bg-red-500";
                setEndNode(node);
            } else if (endNode.id === node.id) {
                node.isEnd = false;
                node.color = "bg-white";
                setEndNode(null);
            }
        } else if (selectMode === "wall" && !node.isStart && !node.isEnd) {
            node.isWall = !node.isWall;
            node.color = "bg-gray-500";
        }
        setGrid(newGrid);
        updateGrid();
    }


    function handleMouseEnter(id) {
        if (!mouseIsPressed) return;
        const newGrid = [...grid];
        const node = newGrid[id];
        if (selectMode === "wall" && !node.isStart && !node.isEnd) {
            node.isWall = !node.isWall;
        }
        setGrid(newGrid);
        updateGrid();
    }


    function updateGrid() {
        const newGrid = [...grid];
        newGrid.forEach(node => {
            if (node.isStart) {
                node.color = "bg-green-500";
            } else if (node.isEnd) {
                node.color = "bg-red-500";
            } else if (node.isWall) {
                node.color = "bg-gray-500";
            } else if (node.isPath) {
                node.color = "bg-blue-700";
            } else if (node.onSearch) {
                node.color = "bg-yellow-400";
            } else if (node.isVisited) {
                node.color = "bg-purple-500";
            } else {
                node.color = "bg-white";
            }
        })
        setGrid(newGrid);
    }


    function setAlgorithmfunc(algorithm) {
        setAlgorithm(algorithm);
        setDropdownOpen(false);
    }


    function setupPresetMaze() {
        const newGrid = [...grid];
        for (let i = 0; i < 1000; i++) {
            if (i % 6 === 0) {
                newGrid[i].isWall = true;
            }
        }
        setGrid(newGrid);
        updateGrid();
    }


    function generateMaze() {
        reset();
        const newGrid = [...grid];
        const visitedInOrder = MazeGenerator(newGrid);
        for (let i = 0; i < grid.length; i++) {
            newGrid[i].isWall = true;
        }
        for (let i = 0; i < visitedInOrder.length; i++) {
            setTimeout(() => {
                const node = visitedInOrder[i];
                newGrid[node.id].isWall = false;
                setGrid(newGrid);
                updateGrid();
            }, i * speed / 4);
        }
    }


    function animatePathFinding(visitedNodesInOrder, nodesInShortestPathOrder, searchedNodesInOrder) {
        const newGrid = [...grid];
        for (let i = 0; i <= visitedNodesInOrder.length; i++) {
            setTimeout(() => {
                //console.log(i);
                const node = visitedNodesInOrder[i];
                for (let i = 0; i < node.currentStack.length; i++) {
                    newGrid[node.currentStack[i].id].onSearch = true;
                }
                newGrid[node.id].isVisited = true;
                newGrid[node.id].onSearch = false;
                setGrid(newGrid);
                updateGrid();
            }, speed * i);
        }
        if (nodesInShortestPathOrder.length === null) {
            return
        }
        setTimeout(() => {
            for (let i = 0; i <= nodesInShortestPathOrder.length; i++) {
                setTimeout(() => {
                    const node = nodesInShortestPathOrder[i];
                    newGrid[node.id].isPath = true;
                    setGrid(newGrid);
                    updateGrid();
                }, speed * i);
            }
        }, speed * (visitedNodesInOrder.length));
    }


    function betterAnimate(visitedNodesInOrder, searchedNodesInOrder) {
        const newGrid = [...grid];
        for (let i = 0; i < visitedNodesInOrder.length; i++) {
            setTimeout(() => {
                for (let x = 0; x < searchedNodesInOrder[i].length; x++) {
                    newGrid[searchedNodesInOrder[i][x].id].onSearch = true;
                }
                const node = visitedNodesInOrder[i];
                newGrid[node.id].isVisited = true;
                newGrid[node.id].onSearch = false;
                setGrid(newGrid);
                updateGrid();
            }, speed * i);
        }
        // updating all distances and prev nodes from visitedNodesInOrder to grid
        for (let i = 0; i < visitedNodesInOrder.length; i++) {
            const node = visitedNodesInOrder[i];
            newGrid[node.id].distance = node.distance;
            newGrid[node.id].previousNode = node.previousNode;
        }
        setGrid(newGrid);
        let prevNode = visitedNodesInOrder.pop();
        for (let i = 0; i <= visitedNodesInOrder[visitedNodesInOrder.length - 1].distance; i++) {
            setTimeout(() => {
                newGrid[prevNode.id].isPath = true;
                newGrid[prevNode.id].isVisited = false;
                setGrid(newGrid);
                updateGrid();
                prevNode = grid[prevNode.previousNode];
            }, speed * (i * 2 + visitedNodesInOrder.length));
        }
    }


    function startPathFinding() {
        setIsRunning(true);
        setIsPathFinding(true);
        setIsPathFound(false);

        const props = {
            grid: [...grid],
            startNode: startNode,
            endNode: endNode,
        }

        if (algorithm === "Deep search algorithm") {
            const { visitedNodesInOrder, nodesInShortestPathOrder, searchedNodesInOrder } = DFS(props);
            animatePathFinding(visitedNodesInOrder, nodesInShortestPathOrder, searchedNodesInOrder);
        } else if (algorithm === "Breadth search algorithm") {
            const { visitedNodesInOrder, nodesInShortestPathOrder, searchedNodesInOrder } = BFS(props);
            console.log("shortestPath", nodesInShortestPathOrder);
            animatePathFinding(visitedNodesInOrder, nodesInShortestPathOrder, searchedNodesInOrder);
        } else if (algorithm === "Dijkstra's algorithm") {
            const { visitedNodesInOrder, searchedNodesInOrder } = Dijkstra(props);
            betterAnimate(visitedNodesInOrder, searchedNodesInOrder);
        } else if (algorithm === "A* algorithm") {
            const { visitedNodesInOrder, nodesInShortestPathOrder, searchedNodesInOrder } = Astar(props);
            console.log("shortestPath", nodesInShortestPathOrder);
            console.log("visitedNodesInOrder", visitedNodesInOrder);
            console.log("searchedNodesInOrder", searchedNodesInOrder);
        }


        setIsRunning(false);
        setIsPathFinding(false);
        setIsPathFound(false);
    }


    function handleSpeedDropdown(value) {
        setSpeed(value);
        setDropdownSpeedOpen(!dropdownSpeedOpen);
    }

    if (grid.length === 0) {
        createGrid();
    }

    let grid_html = [];
    grid.map((node) => {
        grid_html.push(
            <button
                key={node.id}
                id={node.id}
                className={`node ${node.color} w-[30px] h-[30px] ease-in-out duration-[400ms] ${(mouseIsPressed | isRunning) && "hover:scale-125"} ${isRunning && "cursor-not-allowed"}`}
                onMouseDown={() => handleMouseDown(node.id)}
                onMouseUp={() => setMouseIsPressed(false)}
                onMouseEnter={() => handleMouseEnter(node.id)}
            ></button>
        )
    })
    //setGridHTML(grid_html);

    const algorithms = ["Deep search algorithm", "Breadth search algorithm", "Dijkstra's algorithm", "A* algorithm"];
    let dropdownbox = [];
    let dropdownOptions = [];

    algorithms.map((algorithm, index) => {
        dropdownOptions.push(
            <button key={index} className='w-full h-full px-1 py-2 hover:bg-slate-400' onClick={() => setAlgorithmfunc(algorithm)}>{algorithm}</button>
        )
    })

    dropdownbox.push(
        <div className="box w-full absolute top-12 z-10 bg-slate-200">
            {dropdownOptions}
        </div>
    )

    const speedOptions = [
        { name: "Slow", value: 50 },
        { name: "Normal", value: 25 },
        { name: "Fast", value: 10 },
    ];
    let speedDropdownOptions = [];
    let speedDropdownbox = [];

    speedOptions.map((speedOption, index) => {
        speedDropdownOptions.push(
            <button key={index} className='w-full h-full px-1 py-2 hover:bg-slate-400' onClick={() => handleSpeedDropdown(speedOption.value)}>{speedOption.name}</button>
        )
    })

    speedDropdownbox.push(
        <div className="box w-full absolute top-12 z-10 bg-slate-200">
            {speedDropdownOptions}
        </div>
    )


    return (
        <div className='bg-slate-600 w-full h-screen flex flex-col items-center'>
            <div className="controls w-full h-[100px] bg-slate-500">
                <div className="flex flex-row h-full w-full justify-center items-center gap-5">
                    <button className={`bg-green-500 w-[100px] h-[50px] ${selectMode === "start" ? "border-4" : ""} rounded`} onClick={() => setSelectMode("start")}>Start</button>
                    <button className={`bg-red-500 w-[100px] h-[50px] ${selectMode === "end" ? "border-4" : ""} rounded`} onClick={() => setSelectMode("end")}>End</button>
                    <button className={`bg-gray-600 w-[100px] h-[50px] ${selectMode === "wall" ? "border-4" : ""} rounded`} onClick={() => setSelectMode("wall")}>Wall</button>
                    <button className={`bg-blue-500 w-[100px] h-[50px] ${selectMode === "weight" ? "border-4" : ""} rounded`} onClick={() => setSelectMode("weight")}>Weight</button>
                    <button className={`bg-purple-500 w-[100px] h-[50px] ${selectMode === "clear" ? "border-4" : ""} rounded`} onClick={reset}>Clear</button>
                    <button className={`bg-yellow-500 w-[100px] h-[50px] hover:brightness-110 rounded`} onClick={startPathFinding}>Search</button>
                    <div className="dropdown w-[200px] h-[50px] bg-slate-200 relative" onMouseLeave={() => setDropdownOpen(false)}>
                        <button className='dropdown w-full h-full  flex justify-center items-center' onClick={() => setDropdownOpen(!dropdonwOpen)}>
                            <div className="option">{algorithm}</div>
                            <img src={dropdownImage} className={`w-3 h-2 ml-1 mt-1 ${dropdonwOpen ? "rotate-180" : "rotate-0"} ease-in-out duration-300`} alt="" />
                        </button>
                        {dropdonwOpen ? dropdownbox : null}
                    </div>
                    <button className={`bg-slate-400 w-[100px] h-[50px] hover:brightness-110 rounded`} onClick={setupPresetMaze}>Preset</button>
                    <div className="dropdown w-[120px] h-[50px] bg-slate-200 relative" onMouseLeave={() => setDropdownSpeedOpen(false)}>
                        <button className='dropdown w-full h-full  flex justify-center items-center' onClick={() => setDropdownSpeedOpen(!dropdownSpeedOpen)}>
                            <div className="option">Speed: {speed}</div>
                            <img src={dropdownImage} className={`w-3 h-2 ml-1 mt-1 ${dropdownSpeedOpen ? "rotate-180" : "rotate-0"} ease-in-out duration-300`} alt="" />
                        </button>
                        {dropdownSpeedOpen ? speedDropdownbox : null}
                    </div>
                    <button className={`bg-slate-400 w-[200px] h-[50px] hover:brightness-110 rounded`} onClick={generateMaze}>Generate random maze</button>
                </div>
            </div>
            <div className="line bg-black h-1"></div>
            <div className="legend w-full h-[100px] bg-slate-500 flex justify-center items-center">
                <div className="border-2 w-[1000px] h-[50px] bg-slate-400 flex justify-center items-center rounded-sm">
                    <div className="path flex w-[200px] h-[50px] justify-center items-center gap-3 ">
                        <div className="path__node bg-green-500 w-[30px] h-[30px] rounded"></div>
                        <p>Start</p>
                    </div>
                    <div className="path flex w-[200px] h-[50px] justify-center items-center gap-3 ">
                        <div className="path__node bg-red-500 w-[30px] h-[30px] rounded"></div>
                        <p>End</p>
                    </div>
                    <div className="path flex w-[200px] h-[50px] justify-center items-center gap-3">
                        <div className="path__node bg-gray-500 w-[30px] h-[30px] rounded"></div>
                        <p>Wall</p>
                    </div>
                    <div className="path flex w-[200px] h-[50px] justify-center items-center gap-3 ">
                        <div className="path__node bg-blue-700 w-[30px] h-[30px] rounded"></div>
                        <p>Shortest path</p>
                    </div>
                    <div className="path flex w-[200px] h-[50px] justify-center items-center gap-3 ">
                        <div className="path__node bg-purple-500 w-[30px] h-[30px] rounded"></div>
                        <p>Visited node</p>
                    </div>
                    <div className="path flex w-[200px] h-[50px] justify-center items-center gap-3 ">
                        <div className="path__node bg-yellow-400 w-[30px] h-[30px] rounded"></div>
                        <p>Next to visit</p>
                    </div>
                </div>
            </div>
            <div className="grid grid-rows-20 grid-flow-col gap-[3px] bg-gray-400 mt-10" onMouseLeave={() => setMouseIsPressed(false)}>
                {true && grid_html}
            </div>
        </div>
    )
}
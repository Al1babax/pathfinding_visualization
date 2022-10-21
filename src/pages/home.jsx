import { useState, useEffect } from 'react';
import dropdownImage from "../recources/dropdown.png";
import weightImage from "../recources/weight.png";
import { DFS } from "../algorithms/DFS";
import { BFS } from "../algorithms/BFS";
import { Dijkstra } from "../algorithms/Dijkstra";
import { Astar } from "../algorithms/Astar";
import { MazeGenerator } from "../algorithms/MazeGenerator";

export function Home() {

    const [grid, setGrid] = useState([]); // grid is a 2D array of nodes
    const [mouseIsPressed, setMouseIsPressed] = useState(false); // is the mouse pressed
    const [selectMode, setSelectMode] = useState("start"); // what is the current select mode
    const [startNode, setStartNode] = useState(null); // start node
    const [endNode, setEndNode] = useState(null); // end node
    const [isRunning, setIsRunning] = useState(false); // is the algorithm running
    const [algorithm, setAlgorithm] = useState("Choose algorithm"); // current algorithm
    const [speed, setSpeed] = useState(10); // speed of the rendering
    const [dropdonwOpen, setDropdownOpen] = useState(false); // is the dropdown open
    const [dropdownSpeedOpen, setDropdownSpeedOpen] = useState(false); // is the speed dropdown open
    const [shortestPathLength, setShortestPathLength] = useState(0); // length of the shortest path for rendering
    const [visitedNodes, setVisitedNodes] = useState(0); // number of visited nodes for rendering
    const [searchedNodes, setSearchedNodes] = useState(0); // number of searched nodes for rendering
    const [isHelpOpen, setIsHelpOpen] = useState(false); // is the help open
    const [distanceMeasurement, setDistanceMeasurement] = useState("Manhattan"); // distance measurement
    const [isDistanceDropdownOpen, setIsDistanceDropdownOpen] = useState(false); // is the distance dropdown open

    // create the grid to the state
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
                    isWeight: false, // will cause the algo to search nodes with this weight slower
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

    // Resets the whole grid
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
            newGrid[i].isWeight = false;
        }
        setGrid(newGrid);
        setIsRunning(false);
        setShortestPathLength(0);
        setVisitedNodes(0);
        setSearchedNodes(0);
        updateGrid();
    }

    // Resets the grid but keeps the walls and weights and start and end nodes
    function clear() {
        const newGrid = grid.slice();
        for (let i = 0; i < newGrid.length; i++) {
            newGrid[i].isVisited = false;
            newGrid[i].isPath = false;
            newGrid[i].onSearch = false;
            newGrid[i].previousNode = null;
            newGrid[i].distance = Infinity;
        }
        setGrid(newGrid);
        setIsRunning(false);
        setShortestPathLength(0);
        setVisitedNodes(0);
        setSearchedNodes(0);
        updateGrid();
    }

    // Handle the mouse down for placing start and end nodes and walls/weights
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
        } else if (selectMode === "weight" && !node.isStart && !node.isEnd) {
            node.isWeight = !node.isWeight;
            node.color = "bg-blue-500";
        }
        setGrid(newGrid);
        updateGrid();
    }

    // Handle the mouse enter, for placing walls/weights, so you can drag your mouse to place walls/weights
    function handleMouseEnter(id) {
        if (!mouseIsPressed) return;
        const newGrid = [...grid];
        const node = newGrid[id];
        if (selectMode === "wall" && !node.isStart && !node.isEnd) {
            node.isWall = !node.isWall;
        } else if (selectMode === "weight" && !node.isStart && !node.isEnd) {
            node.isWeight = !node.isWeight;
        }
        setGrid(newGrid);
        updateGrid();
    }

    // Updates the grid colors to the grid state variable
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
            } else if (node.isWeight) {
                node.color = "bg-blue-500";
            } else {
                node.color = "bg-white";
            }
        })
        setGrid(newGrid);
    }

    // handles settting algorithm
    function setAlgorithmfunc(algorithm) {
        setAlgorithm(algorithm);
        setDropdownOpen(false);
    }

    // Does maze generation rendering animations
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

    // Does pathfinding rendering animations
    function bestAnimate(visitedNodesInOrder, shortestPathInOrder, onSearchNodesInOrder) {
        // reset node coloring to default in grid
        for (let i = 0; i < grid.length; i++) {
            grid[i].isVisited = false;
            grid[i].isPath = false;
            grid[i].onSearch = false;
        }
        const newGrid = [...grid];
        for (let i = 0; i < visitedNodesInOrder.length; i++) {
            setTimeout(() => {
                for (let x = 0; x < onSearchNodesInOrder[i].length; x++) {
                    setSearchedNodes(prev => prev + 1);
                    newGrid[onSearchNodesInOrder[i][x].id].onSearch = true;
                }
                const node = visitedNodesInOrder[i];
                newGrid[node.id].isVisited = true;
                newGrid[node.id].onSearch = false;
                setVisitedNodes(prev => prev + 1)
                setGrid(newGrid);
                updateGrid();
            }, speed * i);
        }
        for (let i = 0; i < shortestPathInOrder.length; i++) {
            setTimeout(() => {
                const node = shortestPathInOrder[i];
                newGrid[node.id].isPath = true;
                setShortestPathLength(prev => prev + 1);
                setGrid(newGrid);
                updateGrid();
            }, speed * (i + visitedNodesInOrder.length));
        }
    }

    // Function to trigger pathfinding algorithms and animations
    function startPathFinding() {
        setIsRunning(true);
        const props = {
            grid: [...grid],
            startNode: startNode,
            endNode: endNode,
        }

        // check that start and end node have been selected
        if (startNode === null || endNode === null) {
            setIsRunning(false);
            return;
        }

        // removing weights from the grid if these algorithms are selected
        if (algorithm == "Deep search algorithm" | algorithm === "Breadth search algorithm") {
            const newGrid = [...grid];
            for (let i = 0; i < newGrid.length; i++) {
                newGrid[i].isWeight = false;
            }
            setGrid(newGrid);
            updateGrid();
        }


        if (algorithm === "Deep search algorithm") {
            const { visitedNodesInOrder, shortestPathInOrder, searchedNodesInOrder } = DFS(props);
            bestAnimate(visitedNodesInOrder, shortestPathInOrder, searchedNodesInOrder);
        } else if (algorithm === "Breadth search algorithm") {
            const { visitedNodesInOrder, shortestPathInOrder, onSearchNodesInOrder } = BFS(props);
            bestAnimate(visitedNodesInOrder, shortestPathInOrder, onSearchNodesInOrder);
        } else if (algorithm === "Dijkstra's algorithm") {
            const { visitedNodesInOrder, shortestPathInOrder, searchedNodesInOrder } = Dijkstra(props);
            // betterAnimate(visitedNodesInOrder, searchedNodesInOrder);
            bestAnimate(visitedNodesInOrder, shortestPathInOrder, searchedNodesInOrder);
        } else if (algorithm === "A* algorithm") {
            const { visitedNodesInOrder, shortestPathInOrder, onSearchNodesInOrder } = Astar(props, distanceMeasurement);
            bestAnimate(visitedNodesInOrder, shortestPathInOrder, onSearchNodesInOrder);
        }

        setIsRunning(false);
    }


    function handleSpeedDropdown(value) {
        setSpeed(value);
        setDropdownSpeedOpen(!dropdownSpeedOpen);
    }

    // Prevents the user from selecting weight mode if algorithm does not support it
    function handleWeightClick() {
        if (algorithm == "Deep search algorithm" | algorithm === "Breadth search algorithm") {
            return null;
        }
        setSelectMode("weight");
    }

    function handleDistance(metric, algorithm){
        setDistanceMeasurement(metric);
        setAlgorithm(algorithm);
        setIsDistanceDropdownOpen(false);
        setDropdownOpen(false);
    }


    const helpHtml = (
        <div className="absolute top-[20px] left-1/4 w-[1000px] h-[900px] bg-slate-300 rounded-xl z-10 overflow-hidden">
            <div className="close w-full flex justify-end bg-red-0">
                <button className='w-24 h-14 bg-slate-400 rounded-md mt-3 mr-3' onClick={() => setIsHelpOpen(false)}>Close</button>
            </div>
            <div className="area w-full h-full flex justify-center">
                <div className="content w-5/6 h-5/6 bg-red-0">
                    <h1 className='text-center font-bold text-3xl'>Instructions</h1>
                    <p className='text-xl pt-3'>This is a pathfinding visualizer. It is used to visualize different pathfinding algorithms. The algorithms are implemented in JavaScript. The visualizer is built with React.js and Tailwind CSS.</p>
                    <h1 className='font-bold text-2xl mt-10'>How to use</h1>
                    <ol className='list-decimal'>
                        <li className='text-xl pt-3 ml-8'>Place start node by first selecting Start.</li>
                        <li className='text-xl pt-3 ml-8'>Place end node by selecting End.</li>
                        <li className='text-xl pt-3 ml-8'>You can place walls selecting wall OR use auto generator for walls by pressing Generate random maze.</li>
                        <li className='text-xl pt-3 ml-8'>(OPTIONAL) You can also place weights which will act as obstacles by counting each node as 5. (Weights only work for some algorithms.)</li>
                        <li className='text-xl pt-3 ml-8'>Select algorithm from dropdown menu.</li>
                        <li className='text-xl pt-3 ml-8'>Press Start to start the algorithm.</li>
                    </ol>
                    <p className='text-xl pt-3 ml-3'>You can also change speed from dropdown menu.</p>
                    <h1 className='font-bold text-2xl mt-10'>Algorithms</h1>
                    <ol className='list-decimal'>
                        <li className='text-xl pt-3 ml-8'>Deep search algorithm</li>
                        <li className='text-xl pt-3 ml-8'>Breadth search algorithm</li>
                        <li className='text-xl pt-3 ml-8'>Dijkstra's algorithm</li>
                        <li className='text-xl pt-3 ml-8'>A* algorithm</li>
                    </ol>
                    <div className="info flex justify-center gap-10 text-xl pt-6">
                        <p>Full code on:
                            <a href="https://github.com/Al1babax/pathfinding_visualization" target="_blank" rel="noopener noreferrer"><span className='ml-2 text-blue-500 border-2 px-1 bg-blue-100 border-blue-500'>Github</span></a>
                        </p>
                        <p>For further questions contact by email: <span className='text-blue-600'>sami.viik2@gmail.com</span></p>
                    </div>
                </div>
            </div>
        </div>
    )


    if (grid.length === 0) {
        createGrid();
    }

    // Mapping here over the whole grid in state and making html elements out of it
    let grid_html = [];
    grid.map((node) => {
        grid_html.push(
            <button
                key={node.id}
                id={node.id}
                className={`node ${node.color} w-[30px] h-[30px] ease-in-out ${selectMode === "wall" ? "duration-[0ms]" : "duration-[400ms]"} ${(mouseIsPressed | isRunning) && "hover:scale-125"} ${isRunning && "cursor-not-allowed"}`}
                onMouseDown={() => handleMouseDown(node.id)}
                onMouseUp={() => setMouseIsPressed(false)}
                onMouseEnter={() => handleMouseEnter(node.id)}
            ></button>
        )
    })

    // Algorithm dropdown menu
    const algorithms = ["Deep search algorithm", "Breadth search algorithm", "Dijkstra's algorithm", "A* algorithm"];
    let dropdownbox = [];
    let dropdownOptions = [];

    algorithms.map((algorithm, index) => {
        if (algorithm === "A* algorithm") {
            dropdownOptions.push(
                <div className="dropdown" onMouseEnter={() => setIsDistanceDropdownOpen(true)} onMouseLeave={() => setIsDistanceDropdownOpen(false)}>
                    <button key={index} className='w-full h-full px-1 py-2 hover:bg-slate-400 relative' onClick={() => setAlgorithmfunc(algorithm)}>{algorithm}</button>
                    {isDistanceDropdownOpen && <div className="distanceOptions absolute left-[200px] bottom-0 bg-slate-300">
                        <button className='w-[150px] h-full px-1 py-2 hover:bg-slate-400' onClick={() => handleDistance("Manhattan", "A* algorithm")}>Manhattan</button>
                        <button className='w-[150px] h-full px-1 py-2 hover:bg-slate-400' onClick={() => handleDistance("Euclidean", "A* algorithm")}>Euclidean</button>
                    </div>}
                </div>
            )
        } else {
            dropdownOptions.push(
                <button key={index} className='w-full h-full px-1 py-2 hover:bg-slate-400' onClick={() => setAlgorithmfunc(algorithm)}>{algorithm}</button>
            )
        }
    })

    dropdownbox.push(
        <div className="box w-full absolute top-12 z-10 bg-slate-200">
            {dropdownOptions}
        </div>
    )
    
    // Speed dropdown menu
    const speedOptionsHtml = {
        10: "Fast",
        25: "Normal",
        50: "Slow"
    }

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

    // quite long html code here, should maybe break into smaller components, especially with tailwind CSS
    return (
        <div className={`bg-slate-600 w-full h-screen flex flex-col items-center relative`}>
            <div className={`filter absolute w-full h-full bg-black ${isHelpOpen ? "z-10 opacity-50" : "-z-10"}`}></div>
            <div className="controls w-full h-[100px] bg-slate-500">
                <div className="flex flex-row h-full w-full justify-center items-center gap-5">
                    <button className={`bg-green-500 w-[100px] h-[50px] ${selectMode === "start" ? "border-4" : ""} rounded hover:brightness-110`} onClick={() => setSelectMode("start")}>Start</button>
                    <button className={`bg-red-500 w-[100px] h-[50px] ${selectMode === "end" ? "border-4" : ""} rounded hover:brightness-110`} onClick={() => setSelectMode("end")}>End</button>
                    <button className={`bg-gray-400 w-[100px] h-[50px] ${selectMode === "wall" ? "border-4" : ""} rounded hover:brightness-110`} onClick={() => setSelectMode("wall")}>Wall</button>
                    {(algorithm === "Dijkstra's algorithm" | algorithm === "A* algorithm") ?
                        <button className={`bg-blue-500 w-[100px] h-[50px] ${selectMode === "weight" ? "border-4" : ""} rounded hover:brightness-110`} onClick={handleWeightClick}>Weight</button>
                        : <img src={weightImage} className="" alt="" />}
                    <button className={`bg-teal-400 w-[200px] h-[50px] hover:brightness-110 rounded`} onClick={generateMaze}>Generate random maze</button>
                    <div className="dropdown w-[200px] h-[50px] bg-slate-200 relative" onMouseLeave={() => setDropdownOpen(false)}>
                        <button className='dropdown w-full h-full  flex justify-center items-center' onClick={() => setDropdownOpen(!dropdonwOpen)}>
                            <div className="option">{algorithm}</div>
                            <img src={dropdownImage} className={`w-3 h-2 ml-1 mt-1 ${dropdonwOpen ? "rotate-180" : "rotate-0"} ease-in-out duration-300`} alt="" />
                        </button>
                        {dropdonwOpen ? dropdownbox : null}
                    </div>
                    <div className="dropdown w-[150px] h-[50px] bg-slate-200 relative" onMouseLeave={() => setDropdownSpeedOpen(false)}>
                        <button className='dropdown w-full h-full  flex justify-center items-center' onClick={() => setDropdownSpeedOpen(!dropdownSpeedOpen)}>
                            <div className="option">Speed: {speedOptionsHtml[speed]}</div>
                            <img src={dropdownImage} className={`w-3 h-2 ml-1 mt-1 ${dropdownSpeedOpen ? "rotate-180" : "rotate-0"} ease-in-out duration-300`} alt="" />
                        </button>
                        {dropdownSpeedOpen ? speedDropdownbox : null}
                    </div>
                    <button className={`bg-yellow-500 w-[100px] h-[50px] hover:brightness-110 rounded`} onClick={startPathFinding}>Search</button>
                    <button className={`bg-purple-500 w-[100px] h-[50px] ${selectMode === "clear" ? "border-4" : ""} rounded hover:brightness-110`} onClick={clear}>Clear</button>
                    <button className={`bg-purple-500 w-[100px] h-[50px] ${selectMode === "clear" ? "border-4" : ""} rounded hover:brightness-110`} onClick={reset}>Reset</button>
                    <button className={`bg-pink-400 w-[100px] h-[50px] hover:brightness-110 rounded z-10`} onClick={() => setIsHelpOpen(!isHelpOpen)}>Help?</button>
                    {isHelpOpen && helpHtml}
                </div>
            </div>
            <div className="line bg-black h-1"></div>
            <div className="legend w-full h-[120px] bg-slate-500 flex flex-col justify-center items-center">
                <div className="border-2 w-[1400px] h-[50px] bg-slate-400 flex justify-center items-center rounded-sm">
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
                    <div className="path flex w-[200px] h-[50px] justify-center items-center gap-3">
                        <div className="path__node bg-blue-500 w-[30px] h-[30px] rounded"></div>
                        <p>Weight</p>
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
                    <div className="path flex w-[200px] h-[50px] justify-center items-center gap-3 text-lime-300">
                        <p>Distance measurement: <span>{distanceMeasurement}</span></p>
                    </div>
                </div>
                <div className="metrics flex">
                    <div className="path flex w-[200px] h-[50px] justify-center items-center gap-3 ">
                        <div className="path__node bg-blue-700 w-[30px] h-[30px] rounded"></div>
                        <p className='text-blue-300 text-xl font-bold'>=</p>
                        <p className='text-blue-300 text-xl font-bold'>{shortestPathLength}</p>
                    </div>
                    <div className="path flex w-[200px] h-[50px] justify-center items-center gap-3 ">
                        <div className="path__node bg-purple-500 w-[30px] h-[30px] rounded"></div>
                        <p className='text-purple-400 text-xl font-bold'>=</p>
                        <p className='text-purple-400 text-xl font-bold'>{visitedNodes}</p>
                    </div>
                    <div className="path flex w-[200px] h-[50px] justify-center items-center gap-3 ">
                        <div className="path__node bg-yellow-400 w-[30px] h-[30px] rounded"></div>
                        <p className='text-yellow-500 text-xl font-bold'>=</p>
                        <p className='text-yellow-500 text-xl font-bold'>{searchedNodes}</p>
                    </div>
                </div>
            </div>
            <div className="grid grid-rows-20 grid-flow-col gap-[3px] bg-gray-400 mt-10" onMouseLeave={() => setMouseIsPressed(false)}>
                {true && grid_html}
            </div>
        </div>
    )
}
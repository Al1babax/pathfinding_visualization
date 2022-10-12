import { useState, useEffect } from 'react';
import dropdownImage from "../recources/dropdown.png";
import { DFS } from "../algorithms/DFS";

export function Home() {

    const [grid, setGrid] = useState([]);
    const [mouseIsPressed, setMouseIsPressed] = useState(false);
    const [selectMode, setSelectMode] = useState("wall");
    const [startNode, setStartNode] = useState(null);
    const [endNode, setEndNode] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [isPathFound, setIsPathFound] = useState(false);
    const [isPathFinding, setIsPathFinding] = useState(false);
    const [algorithm, setAlgorithm] = useState("Choose algorithm");
    const [speed, setSpeed] = useState(10);
    const [dropdonwOpen, setDropdownOpen] = useState(false);

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
        createGrid();
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
            node.isWall = true;
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
                node.color = "bg-blue-500";
            } else if (node.onSearch) {
                node.color = "bg-yellow-500";
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
            const {visitedNodesInOrder, nodesInShortestPathOrder, searchedNodesInOrder} = DFS(props);
            console.log("shortestPath", nodesInShortestPathOrder);
            animatePathFinding(visitedNodesInOrder, nodesInShortestPathOrder, searchedNodesInOrder);
            //console.log(grid);
        }
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
                className={`node ${node.color} w-[30px] h-[30px]`}
                onMouseDown={() => handleMouseDown(node.id)}
                onMouseUp={() => setMouseIsPressed(false)}
                onMouseEnter={() => handleMouseEnter(node.id)}
            ></button>
        )
    })

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

    

    return (
        <div className='bg-slate-600 w-full h-screen flex flex-col items-center'>
            <div className="controls w-full h-[100px] bg-slate-500">
                <div className="flex flex-row h-full w-full justify-center items-center gap-5">
                    <button className={`bg-green-500 w-[100px] h-[50px] ${selectMode === "start" ? "border-4" : ""}`} onClick={() => setSelectMode("start")}>Start</button>
                    <button className={`bg-red-500 w-[100px] h-[50px] ${selectMode === "end" ? "border-4" : ""}`} onClick={() => setSelectMode("end")}>End</button>
                    <button className={`bg-gray-600 w-[100px] h-[50px] ${selectMode === "wall" ? "border-4" : ""}`} onClick={() => setSelectMode("wall")}>Wall</button>
                    <button className={`bg-blue-500 w-[100px] h-[50px] ${selectMode === "weight" ? "border-4" : ""}`} onClick={() => setSelectMode("weight")}>Weight</button>
                    <button className={`bg-purple-500 w-[100px] h-[50px] ${selectMode === "clear" ? "border-4" : ""}`} onClick={reset}>Clear</button>
                    <button className={`bg-yellow-500 w-[100px] h-[50px] hover:brightness-110`} onClick={startPathFinding}>Search</button>
                    <div className="dropdown w-[200px] h-[50px] bg-slate-200 relative">
                        <button className='dropdown w-full h-full  flex justify-center items-center' onClick={() => setDropdownOpen(!dropdonwOpen)}>
                            <div className="option">{algorithm}</div>
                            <img src={dropdownImage} className={`w-3 h-3 ml-1 mt-1 ${dropdonwOpen ? "rotate-180" : "rotate-0"} ease-in-out duration-300`} alt="" />
                        </button>
                        {dropdonwOpen ? dropdownbox : null}
                    </div>
                    <button className={`bg-slate-400 w-[100px] h-[50px] hover:brightness-110`} onClick={setupPresetMaze}>Preset</button>
                </div>
            </div>
            <div className="legend w-full h-[100px] bg-slate-500"></div>
            <div className="grid grid-rows-20 grid-flow-col gap-[3px] bg-gray-400 mt-10" onMouseLeave={() => setMouseIsPressed(false)}>
                {true && grid_html}
            </div>
        </div>
    )
}
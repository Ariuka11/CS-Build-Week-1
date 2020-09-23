import React, { useState, useCallback, useRef } from "react"
import "./App.css"
import produce from "immer"

const rowNum = 25
const colNum = 25
const possiblities = [
  [0, 0],
  [0, 1],
  [0, -1],
  [1, -1],
  [1, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
]
const emptyGrid = []
for (let i = 0; i < rowNum; i++) {
  emptyGrid.push(Array.from(Array(colNum), () => 0))
}

function App() {
  const randomGrid = () => {
    const randomGrid = []
    for (let i = 0; i < rowNum; i++) {
      randomGrid.push(
        Array.from(Array(colNum), () => Math.round(Math.random()))
      )
    }
    return randomGrid
  }
  const [grid, setGrid] = useState(() => {
    return emptyGrid
  })
  const [toggle, setToggle] = useState(true)

  const [options, setOptions] = useState({
    speed: 50,
    size: 20,
    color: "orange",
  })
  const [run, setRun] = useState(false)

  const [gen, setGen] = useState(0)

  const runRef = useRef(run)
  runRef.current = run

  const speedRef = useRef(options.speed)
  speedRef.current = options.speed

  const simulation = () => {
    setGrid((g) => {
      return produce(g, (gridCopy) => {
        for (let i = 0; i < rowNum; i++) {
          for (let j = 0; j < colNum; j++) {
            let neighbors = 0

            possiblities.forEach(([x, y]) => {
              const newI = i + x
              const newJ = j + y
              if (newI >= 0 && newI < rowNum && newJ >= 0 && newJ < colNum) {
                neighbors += g[newI][newJ]
              }
            })

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][j] = 0
            } else if (g[i][j] === 0 && neighbors === 3) {
              gridCopy[i][j] = 1
            }
          }
        }
      })
    })
  }

  const startSimulation = useCallback(() => {
    if (!runRef.current) {
      setToggle(true)
      return
    } else {
      setGen((gen) => (gen += 1))
      simulation()
      setToggle(false)
      setTimeout(startSimulation, speedRef.current * 10)
    }
  }, [])

  const handleChange = (event) => {
    setOptions({
      ...options,
      [event.target.name]:
        event.target.name === "color"
          ? event.target.value
          : parseInt(event.target.value),
    })
  }
  const toggleCell = (rowI, colI) => {
    const newGrid = produce(grid, (gridCopy) => {
      gridCopy[rowI][colI] = gridCopy[rowI][colI] ? 0 : 1
    })
    setGrid(newGrid)
  }

  const generateGrid = () => {
    return grid.map((rows, i) =>
      rows.map((col, j) => (
        <div
          key={`${i} - ${j}`}
          onClick={() => (toggle ? toggleCell(i, j) : undefined)}
          style={{
            width: options.size,
            height: options.size,
            background: grid[i][j] ? options.color : "black",
            border: "solid 1px white",
          }}
        />
      ))
    )
  }
  return (
    <div>
      <div
        className="App"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${colNum}, ${options.size}px)`,
        }}
      >
        {generateGrid()}
      </div>
      <form>
        <input
          type="text"
          name="color"
          placeholder="Cell Color"
          onChange={handleChange}
        />
        <input
          type="number"
          name="size"
          placeholder="Cell Size"
          step="1"
          min="1"
          onChange={handleChange}
        />
        <input
          type="number"
          name="speed"
          placeholder="Speed"
          onChange={handleChange}
        />
      </form>
      <div>Generations:{gen}</div>
      <button
        onClick={() => {
          setRun(!run)
          if (!run) {
            runRef.current = true
            startSimulation()
          }
        }}
      >
        {run ? "Stop" : "Start"}
      </button>
      <button
        onClick={() => {
          setGrid(emptyGrid)
          setGen(0)
        }}
      >
        Clear
      </button>
      <button
        onClick={() => {
          setGrid(randomGrid())
          setGen(0)
        }}
      >
        Random Grid
      </button>
    </div>
  )
}

export default App

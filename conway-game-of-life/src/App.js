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

function App() {
  const [grid, setGrid] = useState(() => {
    const rows = []
    for (let i = 0; i < rowNum; i++) {
      rows.push(Array.from(Array(colNum), () => 0))
    }
    return rows
  })

  const [run, setRun] = useState(false)

  const runRef = useRef(run)
  runRef.current = run

  const startSimulation = useCallback(() => {
    if (!runRef.current) {
      return
    } else {
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
      setTimeout(startSimulation, 500)
    }
  }, [])
  return (
    <div>
      <div
        className="App"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${colNum}, 20px)`,
        }}
      >
        {grid.map((rows, i) =>
          rows.map((col, j) => (
            <div
              key={`${i} - ${j}`}
              onClick={() => {
                const newGrid = produce(grid, (gridCopy) => {
                  gridCopy[i][j] = gridCopy[i][j] ? 0 : 1
                })
                setGrid(newGrid)
              }}
              style={{
                width: 20,
                height: 20,
                background: grid[i][j] ? "green" : undefined,
                border: "solid 1px black",
              }}
            />
          ))
        )}
      </div>
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
    </div>
  )
}

export default App

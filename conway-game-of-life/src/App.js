import React, { useState } from "react"
import "./App.css"

const rowNum = 25
const colNum = 25

function App() {
  const [grid, setGrid] = useState(() => {
    const rows = []
    for (let i = 0; i < rowNum; i++) {
      rows.push(Array.from(Array(colNum), () => 0))
    }
    return rows
  })
  return (
    <div className="App" style = {{
      display: 'grid',
      gridTemplateColumns: `repeat(${colNum}, 20px)`
    }}>
      {grid.map((rows, i) =>
        rows.map((col, j) => (
          <div
            key={`${i} - ${j}`}
            style={{
              width: 20,
              height: 20,
              background: grid[i][j] ? "green" : undefined,
              border: 'solid 1px black'
            }}
          />
        ))
      )}
    </div>
  )
}

export default App

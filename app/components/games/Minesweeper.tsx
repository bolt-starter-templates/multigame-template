'use client'

import { useState, useEffect } from 'react'
import { Bomb, Flag } from 'lucide-react'

const GRID_SIZE = 10
const MINE_COUNT = 15

type Cell = {
  isMine: boolean
  isRevealed: boolean
  isFlagged: boolean
  neighborMines: number
}

export default function Minesweeper() {
  const [grid, setGrid] = useState<Cell[][]>([])
  const [gameOver, setGameOver] = useState(false)
  const [win, setWin] = useState(false)

  useEffect(() => {
    initializeGrid()
  }, [])

  const initializeGrid = () => {
    const newGrid: Cell[][] = Array(GRID_SIZE).fill(null).map(() =>
      Array(GRID_SIZE).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0,
      }))
    )

    // Place mines
    let minesPlaced = 0
    while (minesPlaced < MINE_COUNT) {
      const row = Math.floor(Math.random() * GRID_SIZE)
      const col = Math.floor(Math.random() * GRID_SIZE)
      if (!newGrid[row][col].isMine) {
        newGrid[row][col].isMine = true
        minesPlaced++
      }
    }

    // Calculate neighbor mines
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (!newGrid[row][col].isMine) {
          newGrid[row][col].neighborMines = countNeighborMines(newGrid, row, col)
        }
      }
    }

    setGrid(newGrid)
    setGameOver(false)
    setWin(false)
  }

  const countNeighborMines = (grid: Cell[][], row: number, col: number) => {
    let count = 0
    for (let r = -1; r <= 1; r++) {
      for (let c = -1; c <= 1; c++) {
        const newRow = row + r
        const newCol = col + c
        if (newRow >= 0 && newRow < GRID_SIZE && newCol >= 0 && newCol < GRID_SIZE) {
          if (grid[newRow][newCol].isMine) count++
        }
      }
    }
    return count
  }

  const handleCellClick = (row: number, col: number) => {
    if (gameOver || win || grid[row][col].isRevealed || grid[row][col].isFlagged) return

    const newGrid = [...grid]
    if (newGrid[row][col].isMine) {
      revealAllMines(newGrid)
      setGameOver(true)
    } else {
      revealCell(newGrid, row, col)
      if (checkWin(newGrid)) {
        setWin(true)
      }
    }
    setGrid(newGrid)
  }

  const handleCellRightClick = (e: React.MouseEvent, row: number, col: number) => {
    e.preventDefault()
    if (gameOver || win || grid[row][col].isRevealed) return

    const newGrid = [...grid]
    newGrid[row][col].isFlagged = !newGrid[row][col].isFlagged
    setGrid(newGrid)
  }

  const revealCell = (grid: Cell[][], row: number, col: number) => {
    if (row < 0 || row >= GRID_SIZE || col < 0 || col >= GRID_SIZE || grid[row][col].isRevealed) return

    grid[row][col].isRevealed = true
    if (grid[row][col].neighborMines === 0) {
      for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
          revealCell(grid, row + r, col + c)
        }
      }
    }
  }

  const revealAllMines = (grid: Cell[][]) => {
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (grid[row][col].isMine) {
          grid[row][col].isRevealed = true
        }
      }
    }
  }

  const checkWin = (grid: Cell[][]) => {
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        if (!grid[row][col].isMine && !grid[row][col].isRevealed) {
          return false
        }
      }
    }
    return true
  }

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Minesweeper</h2>
      <div className="mb-4">
        <button className="game-button" onClick={initializeGrid}>New Game</button>
      </div>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)` }}>
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              className={`w-8 h-8 flex items-center justify-center border ${
                cell.isRevealed
                  ? cell.isMine
                    ? 'bg-red-500'
                    : 'bg-gray-200'
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
              onContextMenu={(e) => handleCellRightClick(e, rowIndex, colIndex)}
            >
              {cell.isRevealed ? (
                cell.isMine ? (
                  <Bomb size={16} />
                ) : cell.neighborMines > 0 ? (
                  cell.neighborMines
                ) : null
              ) : cell.isFlagged ? (
                <Flag size={16} />
              ) : null}
            </button>
          ))
        )}
      </div>
      {gameOver && <div className="mt-4 text-xl font-bold text-red-500">Game Over!</div>}
      {win && <div className="mt-4 text-xl font-bold text-green-500">You Win!</div>}
    </div>
  )
}


'use client'

import { useState, useEffect } from 'react'
import { Circle } from 'lucide-react'

type Piece = 'red' | 'black' | null

const initialBoard: Piece[][] = [
  [null, 'black', null, 'black', null, 'black', null, 'black'],
  ['black', null, 'black', null, 'black', null, 'black', null],
  [null, 'black', null, 'black', null, 'black', null, 'black'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['red', null, 'red', null, 'red', null, 'red', null],
  [null, 'red', null, 'red', null, 'red', null, 'red'],
  ['red', null, 'red', null, 'red', null, 'red', null],
]

interface Move {
  from: [number, number]
  to: [number, number]
}

export default function Checkers() {
  const [board, setBoard] = useState<Piece[][]>(initialBoard)
  const [currentPlayer, setCurrentPlayer] = useState<'red' | 'black'>('red')
  const [selectedPiece, setSelectedPiece] = useState<[number, number] | null>(null)

  const isValidMove = (from: [number, number], to: [number, number]): boolean => {
    const [fromRow, fromCol] = from
    const [toRow, toCol] = to

    const rowDiff = toRow - fromRow
    const colDiff = Math.abs(toCol - fromCol)

    if (board[toRow][toCol] !== null) return false

    if (currentPlayer === 'red' && rowDiff !== -1) return false
    if (currentPlayer === 'black' && rowDiff !== 1) return false

    return colDiff === 1
  }

  const getValidMoves = (player: 'red' | 'black'): Move[] => {
    const moves: Move[] = []
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (board[row][col] === player) {
          const directions = player === 'red' ? [[-1, -1], [-1, 1]] : [[1, -1], [1, 1]]
          for (const [dx, dy] of directions) {
            const newRow = row + dx
            const newCol = col + dy
            if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8 && isValidMove([row, col], [newRow, newCol])) {
              moves.push({ from: [row, col], to: [newRow, newCol] })
            }
          }
        }
      }
    }
    return moves
  }

  const evaluateBoard = (board: Piece[][]): number => {
    let score = 0
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if (board[row][col] === 'black') score++
        else if (board[row][col] === 'red') score--
      }
    }
    return score
  }

  const minMax = (depth: number, isMaximizing: boolean): [number, Move | null] => {
    if (depth === 0) {
      return [evaluateBoard(board), null]
    }

    const moves = getValidMoves(isMaximizing ? 'black' : 'red')
    if (moves.length === 0) {
      return [isMaximizing ? -Infinity : Infinity, null]
    }

    let bestScore = isMaximizing ? -Infinity : Infinity
    let bestMove: Move | null = null

    for (const move of moves) {
      const newBoard = board.map(row => [...row])
      newBoard[move.to[0]][move.to[1]] = newBoard[move.from[0]][move.from[1]]
      newBoard[move.from[0]][move.from[1]] = null

      const [score, _] = minMax(depth - 1, !isMaximizing)

      if (isMaximizing) {
        if (score > bestScore) {
          bestScore = score
          bestMove = move
        }
      } else {
        if (score < bestScore) {
          bestScore = score
          bestMove = move
        }
      }
    }

    return [bestScore, bestMove]
  }

  const makeMove = (from: [number, number], to: [number, number]) => {
    const newBoard = board.map(row => [...row])
    newBoard[to[0]][to[1]] = newBoard[from[0]][from[1]]
    newBoard[from[0]][from[1]] = null
    setBoard(newBoard)
    setCurrentPlayer(currentPlayer === 'red' ? 'black' : 'red')
  }

  const handleClick = (row: number, col: number) => {
    if (currentPlayer === 'red') {
      if (!selectedPiece) {
        if (board[row][col] === 'red') {
          setSelectedPiece([row, col])
        }
      } else {
        const [selectedRow, selectedCol] = selectedPiece

        if (isValidMove([selectedRow, selectedCol], [row, col])) {
          makeMove([selectedRow, selectedCol], [row, col])
        }

        setSelectedPiece(null)
      }
    }
  }

  useEffect(() => {
    if (currentPlayer === 'black') {
      const [_, bestMove] = minMax(3, true)
      if (bestMove) {
        setTimeout(() => {
          makeMove(bestMove.from, bestMove.to)
        }, 500)
      }
    }
  }, [currentPlayer])

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Checkers</h2>
      <div className="mb-4">Current player: {currentPlayer}</div>
      <div className="grid grid-cols-8 gap-1">
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              className={`w-12 h-12 ${
                (rowIndex + colIndex) % 2 === 0 ? 'bg-gray-200' : 'bg-gray-400'
              } flex items-center justify-center`}
              onClick={() => handleClick(rowIndex, colIndex)}
            >
              {piece && (
                <Circle
                  className={`w-8 h-8 ${
                    piece === 'red' ? 'text-red-500' : 'text-black'
                  } ${
                    selectedPiece &&
                    selectedPiece[0] === rowIndex &&
                    selectedPiece[1] === colIndex ? 'ring-2 ring-yellow-400' : ''
                  }`}
                  fill={piece === 'red' ? 'rgb(239 68 68)' : 'rgb(0 0 0)'}
                />
              )}
            </button>
          ))
        )}
      </div>
    </div>
  )
}


'use client'

import { useState, useEffect } from 'react'
import { X, Circle, Trophy } from 'lucide-react'

type Player = 'X' | 'O' | null

export default function TicTacToe() {
  const [board, setBoard] = useState<Player[]>(Array(9).fill(null))
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X')
  const [winner, setWinner] = useState<Player>(null)

  const checkWinner = (squares: Player[]): Player => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ]

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i]
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }
    }

    return null
  }

  const handleClick = (index: number) => {
    if (board[index] || winner) return

    const newBoard = [...board]
    newBoard[index] = currentPlayer
    setBoard(newBoard)

    const newWinner = checkWinner(newBoard)
    if (newWinner) {
      setWinner(newWinner)
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X')
    }
  }

  useEffect(() => {
    if (currentPlayer === 'O' && !winner) {
      const emptySquares = board.reduce((acc, square, index) => {
        if (!square) acc.push(index)
        return acc
      }, [] as number[])

      if (emptySquares.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptySquares.length)
        setTimeout(() => handleClick(emptySquares[randomIndex]), 500)
      }
    }
  }, [currentPlayer, winner])

  const renderSquare = (index: number) => (
    <button
      key={index}
      className="w-20 h-20 border border-gray-400 text-4xl font-bold flex items-center justify-center"
      onClick={() => handleClick(index)}
    >
      {board[index] === 'X' && <X className="w-12 h-12 text-blue-500" />}
      {board[index] === 'O' && <Circle className="w-12 h-12 text-red-500" />}
    </button>
  )

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Tic-Tac-Toe</h2>
      <div className="mb-4 flex items-center">
        {winner ? (
          <>
            <Trophy className="mr-2 text-yellow-500" />
            Winner: {winner}
          </>
        ) : board.every((square) => square) ? (
          "It's a draw!"
        ) : (
          <>
            Current player: {currentPlayer === 'X' ? <X className="inline w-6 h-6 text-blue-500" /> : <Circle className="inline w-6 h-6 text-red-500" />}
          </>
        )}
      </div>
      <div className="grid grid-cols-3 gap-1">
        {board.map((_, index) => renderSquare(index))}
      </div>
    </div>
  )
}


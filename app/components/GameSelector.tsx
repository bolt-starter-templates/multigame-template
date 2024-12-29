'use client'

import { useState } from 'react'
import Hangman from './games/Hangman'
import TicTacToe from './games/TicTacToe'
import Checkers from './games/Checkers'
import Snake from './games/Snake'
import Blackjack from './games/Blackjack'
import Minesweeper from './games/Minesweeper'
import { GavelIcon as Gallows, Circle, Square, ChevronLeft, Disc, HeartIcon as Hearts, Dices, Grid } from 'lucide-react'

const games = [
  { id: 'hangman', name: 'Hangman', icon: Gallows },
  { id: 'tictactoe', name: 'Tic-Tac-Toe', icon: Circle },
  { id: 'checkers', name: 'Checkers', icon: Square },
  { id: 'snake', name: 'Snake', icon: Disc },
  { id: 'blackjack', name: 'Blackjack', icon: Hearts },
  { id: 'minesweeper', name: 'Minesweeper', icon: Grid },
]

export default function GameSelector() {
  const [selectedGame, setSelectedGame] = useState<string | null>(null)

  const renderGame = () => {
    switch (selectedGame) {
      case 'hangman':
        return <Hangman />
      case 'tictactoe':
        return <TicTacToe />
      case 'checkers':
        return <Checkers />
      case 'snake':
        return <Snake />
      case 'blackjack':
        return <Blackjack />
      case 'minesweeper':
        return <Minesweeper />
      default:
        return null
    }
  }

  return (
    <div className="w-full max-w-4xl flex flex-col items-center">
      {!selectedGame ? (
        <div className="flex flex-col space-y-4 w-full max-w-md">
          {games.map((game) => (
            <button
              key={game.id}
              className="game-button flex items-center justify-center px-6 py-4 text-lg"
              onClick={() => setSelectedGame(game.id)}
            >
              <game.icon className="mr-3 w-6 h-6" />
              {game.name}
            </button>
          ))}
        </div>
      ) : (
        <div className="w-full">
          <button
            className="back-button flex items-center mb-4"
            onClick={() => setSelectedGame(null)}
          >
            <ChevronLeft className="mr-2" />
            Back to Game Selection
          </button>
          {renderGame()}
        </div>
      )}
    </div>
  )
}


'use client'

import { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle } from 'lucide-react'

const words = ['react', 'javascript', 'typescript', 'nextjs', 'tailwind']

export default function Hangman() {
  const [word, setWord] = useState('')
  const [guessedLetters, setGuessedLetters] = useState<Set<string>>(new Set())
  const [remainingGuesses, setRemainingGuesses] = useState(6)

  useEffect(() => {
    setWord(words[Math.floor(Math.random() * words.length)])
  }, [])

  const guessLetter = (letter: string) => {
    if (guessedLetters.has(letter)) return

    const newGuessedLetters = new Set(guessedLetters)
    newGuessedLetters.add(letter)
    setGuessedLetters(newGuessedLetters)

    if (!word.includes(letter)) {
      setRemainingGuesses(remainingGuesses - 1)
    }
  }

  const maskedWord = word
    .split('')
    .map((letter) => (guessedLetters.has(letter) ? letter : '_'))
    .join(' ')

  const isGameOver = remainingGuesses === 0 || !maskedWord.includes('_')

  const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('')

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Hangman</h2>
      <div className="text-4xl mb-4">{maskedWord}</div>
      <div className="mb-4 flex items-center">
        <AlertCircle className="mr-2 text-red-500" />
        Remaining Guesses: {remainingGuesses}
      </div>
      <div className="mb-4">
        <svg width="200" height="250" viewBox="0 0 200 250" className="text-gray-700">
          {/* Base */}
          <line x1="20" y1="230" x2="180" y2="230" strokeWidth="10" />
          {/* Vertical bar */}
          <line x1="40" y1="230" x2="40" y2="30" strokeWidth="10" />
          {/* Horizontal bar */}
          <line x1="40" y1="30" x2="140" y2="30" strokeWidth="10" />
          {/* Rope */}
          <line x1="140" y1="30" x2="140" y2="60" strokeWidth="5" />
          {/* Head */}
          {remainingGuesses < 6 && <circle cx="140" cy="80" r="20" fill="none" strokeWidth="5" />}
          {/* Body */}
          {remainingGuesses < 5 && <line x1="140" y1="100" x2="140" y2="150" strokeWidth="5" />}
          {/* Left arm */}
          {remainingGuesses < 4 && <line x1="140" y1="120" x2="120" y2="140" strokeWidth="5" />}
          {/* Right arm */}
          {remainingGuesses < 3 && <line x1="140" y1="120" x2="160" y2="140" strokeWidth="5" />}
          {/* Left leg */}
          {remainingGuesses < 2 && <line x1="140" y1="150" x2="120" y2="180" strokeWidth="5" />}
          {/* Right leg */}
          {remainingGuesses < 1 && <line x1="140" y1="150" x2="160" y2="180" strokeWidth="5" />}
        </svg>
      </div>
      {!isGameOver ? (
        <div className="grid grid-cols-7 gap-2">
          {alphabet.map((letter) => (
            <button
              key={letter}
              className={`w-10 h-10 rounded ${
                guessedLetters.has(letter)
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'game-button'
              }`}
              onClick={() => guessLetter(letter)}
              disabled={guessedLetters.has(letter)}
            >
              {letter}
            </button>
          ))}
        </div>
      ) : (
        <div className="text-xl flex items-center">
          {remainingGuesses === 0 ? (
            <>
              <AlertCircle className="mr-2 text-red-500" />
              Game Over! The word was: {word}
            </>
          ) : (
            <>
              <CheckCircle className="mr-2 text-green-500" />
              Congratulations! You guessed the word!
            </>
          )}
        </div>
      )}
    </div>
  )
}


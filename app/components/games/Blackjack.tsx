'use client'

import { useState, useEffect } from 'react'

type Suit = '♠' | '♥' | '♦' | '♣'
type Value = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K'
type Card = { suit: Suit; value: Value }

const SUITS: Suit[] = ['♠', '♥', '♦', '♣']
const VALUES: Value[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

function createDeck(): Card[] {
  return SUITS.flatMap(suit => VALUES.map(value => ({ suit, value })))
}

function shuffleDeck(deck: Card[]): Card[] {
  return deck.sort(() => Math.random() - 0.5)
}

function calculateHandValue(hand: Card[]): number {
  let value = 0
  let aces = 0

  for (const card of hand) {
    if (card.value === 'A') {
      aces += 1
    } else if (['K', 'Q', 'J'].includes(card.value)) {
      value += 10
    } else {
      value += parseInt(card.value)
    }
  }

  for (let i = 0; i < aces; i++) {
    if (value + 11 <= 21) {
      value += 11
    } else {
      value += 1
    }
  }

  return value
}

export default function Blackjack() {
  const [deck, setDeck] = useState<Card[]>([])
  const [playerHand, setPlayerHand] = useState<Card[]>([])
  const [dealerHand, setDealerHand] = useState<Card[]>([])
  const [gameState, setGameState] = useState<'betting' | 'playing' | 'dealerTurn' | 'gameOver'>('betting')
  const [message, setMessage] = useState('')
  const [bet, setBet] = useState(10)
  const [balance, setBalance] = useState(100)

  useEffect(() => {
    resetGame()
  }, [])

  const resetGame = () => {
    const newDeck = shuffleDeck(createDeck())
    setDeck(newDeck)
    setPlayerHand([])
    setDealerHand([])
    setGameState('betting')
    setMessage('')
  }

  const dealInitialCards = () => {
    const newDeck = [...deck]
    const newPlayerHand = [newDeck.pop()!, newDeck.pop()!]
    const newDealerHand = [newDeck.pop()!, newDeck.pop()!]
    setDeck(newDeck)
    setPlayerHand(newPlayerHand)
    setDealerHand(newDealerHand)
    setGameState('playing')
  }

  const hit = () => {
    const newDeck = [...deck]
    const newPlayerHand = [...playerHand, newDeck.pop()!]
    setDeck(newDeck)
    setPlayerHand(newPlayerHand)

    if (calculateHandValue(newPlayerHand) > 21) {
      setGameState('gameOver')
      setMessage('Bust! You lose.')
      setBalance(balance - bet)
    }
  }

  const stand = () => {
    setGameState('dealerTurn')
    let newDealerHand = [...dealerHand]
    let newDeck = [...deck]

    while (calculateHandValue(newDealerHand) < 17) {
      newDealerHand.push(newDeck.pop()!)
    }

    setDealerHand(newDealerHand)
    setDeck(newDeck)

    const playerValue = calculateHandValue(playerHand)
    const dealerValue = calculateHandValue(newDealerHand)

    if (dealerValue > 21 || playerValue > dealerValue) {
      setMessage('You win!')
      setBalance(balance + bet)
    } else if (dealerValue > playerValue) {
      setMessage('Dealer wins!')
      setBalance(balance - bet)
    } else {
      setMessage('Push!')
    }

    setGameState('gameOver')
  }

  const renderHand = (hand: Card[], hideFirst = false) => (
    <div className="flex space-x-2">
      {hand.map((card, index) => (
        <div
          key={index}
          className={`w-10 h-16 border border-gray-300 rounded flex items-center justify-center ${
            card.suit === '♥' || card.suit === '♦' ? 'text-red-500' : 'text-black'
          } bg-white`}
        >
          {hideFirst && index === 0 ? '?' : `${card.value}${card.suit}`}
        </div>
      ))}
    </div>
  )

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Blackjack</h2>
      <div className="mb-4 text-black">Balance: ${balance}</div>
      {gameState === 'betting' && (
        <div>
          <input
            type="number"
            value={bet}
            onChange={(e) => setBet(Math.max(1, Math.min(balance, parseInt(e.target.value))))}
            className="border border-gray-300 rounded px-2 py-1 mr-2 text-black"
          />
          <button className="game-button" onClick={dealInitialCards}>
            Place Bet
          </button>
        </div>
      )}
      {gameState !== 'betting' && (
        <div className="space-y-4">
          <div>
            <h3 className="font-bold text-black">Dealer's Hand</h3>
            {renderHand(dealerHand, gameState === 'playing')}
          </div>
          <div>
            <h3 className="font-bold text-black">Your Hand</h3>
            {renderHand(playerHand)}
          </div>
          {gameState === 'playing' && (
            <div className="flex space-x-2">
              <button className="game-button" onClick={hit}>
                Hit
              </button>
              <button className="game-button" onClick={stand}>
                Stand
              </button>
            </div>
          )}
          {gameState === 'gameOver' && (
            <div>
              <p className="text-xl font-bold text-black">{message}</p>
              <button className="game-button mt-2" onClick={resetGame}>
                Play Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}


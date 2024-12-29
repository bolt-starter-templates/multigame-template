import './globals.css'
import { ReactNode } from 'react'

export const metadata = {
  title: 'Multi-Game Webapp',
  description: 'Play Tic-Tac-Toe, Checkers, Snake, Blackjack, and Minesweeper',
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}


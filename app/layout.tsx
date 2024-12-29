import './globals.css'

export const metadata = {
  title: 'Multi-Game Webapp',
  description: 'Play Hangman, Tic-Tac-Toe, and Checkers',
}
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}


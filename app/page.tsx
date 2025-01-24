"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import confetti from "canvas-confetti"
import { Analytics } from "@vercel/analytics/react"
import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { WORDS, getRandomWord } from "@/lib/words"
import { Announcements } from "@/components/announcements"
import { SocialLinks } from "@/components/social-links"

interface GameStats {
  gamesPlayed: number
  gamesWon: number
  currentStreak: number
  bestStreak: number
}

const initialStats: GameStats = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  bestStreak: 0,
}

export default function TechWordle() {
  const [guesses, setGuesses] = useState<string[]>([])
  const [currentGuess, setCurrentGuess] = useState("")
  const [targetWord, setTargetWord] = useState("")
  const [gameOver, setGameOver] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [stats, setStats] = useState<GameStats>(initialStats)
  const [announcement, setAnnouncement] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null)

  useEffect(() => {
    setTargetWord(getRandomWord())
    const savedStats = localStorage.getItem("techWordleStats")
    if (savedStats) {
      setStats(JSON.parse(savedStats))
    }
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode)
  }, [isDarkMode])

  const updateStats = (won: boolean) => {
    const newStats = {
      ...stats,
      gamesPlayed: stats.gamesPlayed + 1,
      gamesWon: stats.gamesWon + (won ? 1 : 0),
      currentStreak: won ? stats.currentStreak + 1 : 0,
      bestStreak: won ? Math.max(stats.currentStreak + 1, stats.bestStreak) : stats.bestStreak,
    }
    setStats(newStats)
    localStorage.setItem("techWordleStats", JSON.stringify(newStats))
  }

  const handleKeyPress = (e: KeyboardEvent) => {
    if (gameOver) return

    if (e.key === "Enter") {
      if (currentGuess.length !== targetWord.length) {
        setAnnouncement({ message: `Word must be ${targetWord.length} letters!`, type: "error" })
        return
      }

      const newGuesses = [...guesses, currentGuess.toUpperCase()]
      setGuesses(newGuesses)
      setCurrentGuess("")

      if (currentGuess.toUpperCase() === targetWord) {
        setGameOver(true)
        updateStats(true)
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        })
        setAnnouncement({
          message: `Congratulations! You won in ${newGuesses.length} ${newGuesses.length === 1 ? "try" : "tries"}!`,
          type: "success",
        })
      } else if (newGuesses.length === 6) {
        setGameOver(true)
        updateStats(false)
        setAnnouncement({
          message: `Game Over! The word was ${targetWord}`,
          type: "info",
        })
      }
    } else if (e.key === "Backspace") {
      setCurrentGuess((prev) => prev.slice(0, -1))
    } else if (currentGuess.length < targetWord.length && e.key.match(/^[a-zA-Z]$/)) {
      setCurrentGuess((prev) => prev + e.key.toUpperCase())
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [currentGuess, gameOver, targetWord])

  const getLetterStyle = (letter: string, index: number, guess: string) => {
    if (guess[index] === targetWord[index]) {
      return "bg-green-500 text-white border-green-500"
    }
    if (targetWord.includes(guess[index])) {
      return "bg-yellow-500 text-white border-yellow-500"
    }
    return "bg-gray-500 text-white border-gray-500"
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="w-48 h-24 relative">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wordle-XB8K1jKmu2kg2FTub9jHeOtzSNjb4X.png"
              alt="Tech Wordle Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
          <Button variant="ghost" size="icon" onClick={() => setIsDarkMode(!isDarkMode)} className="rounded-full">
            {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </Button>
        </div>

        <div className="flex justify-center gap-8 mb-8">
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.gamesPlayed}</div>
            <div className="text-sm text-muted-foreground">Played</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{Math.round((stats.gamesWon / stats.gamesPlayed) * 100) || 0}%</div>
            <div className="text-sm text-muted-foreground">Win Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.currentStreak}</div>
            <div className="text-sm text-muted-foreground">Current Streak</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold">{stats.bestStreak}</div>
            <div className="text-sm text-muted-foreground">Best Streak</div>
          </div>
        </div>

        {announcement && <Announcements message={announcement.message} type={announcement.type} />}

        <div className="grid grid-rows-6 gap-2 max-w-sm mx-auto mb-8">
          {Array(6)
            .fill(null)
            .map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="grid gap-2"
                style={{ gridTemplateColumns: `repeat(${targetWord.length}, minmax(0, 1fr))` }}
              >
                {Array(targetWord.length)
                  .fill(null)
                  .map((_, colIndex) => {
                    const letter = rowIndex === guesses.length ? currentGuess[colIndex] : guesses[rowIndex]?.[colIndex]

                    const style = guesses[rowIndex]
                      ? getLetterStyle(letter, colIndex, guesses[rowIndex])
                      : "border-gray-300 dark:border-gray-600"

                    return (
                      <div
                        key={colIndex}
                        className={`w-full aspect-square flex items-center justify-center text-2xl font-bold border-2 ${style}`}
                      >
                        {letter}
                      </div>
                    )
                  })}
              </div>
            ))}
        </div>

        <div className="max-w-2xl mx-auto mt-8 p-6 bg-card rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold mb-4">How to Play</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Guess the tech-related word in 6 tries.</li>
            <li>The length of the word varies for each game.</li>
            <li>After each guess, the color of the tiles will change to show how close your guess was:</li>
            <ul className="list-none pl-5 mt-2">
              <li className="flex items-center gap-2">
                <div className="w-6 h-6 bg-green-500"></div>
                <span>Green: Letter is in the correct spot</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-6 h-6 bg-yellow-500"></div>
                <span>Yellow: Letter is in the word but in the wrong spot</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-500"></div>
                <span>Gray: Letter is not in the word</span>
              </li>
            </ul>
          </ul>
        </div>

        <SocialLinks />
      </div>
      <Analytics />
    </div>
  )
}


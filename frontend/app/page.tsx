"use client"

import { useState, useEffect } from "react"
import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import WeatherSection from "@/components/weather-section"
import AirQualitySection from "@/components/air-quality-section"
import AQIInfoSection from "@/components/aqi-info-section"
import Footer from "@/components/footer"

export default function App() {
  // Dark mode state management
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Initialize dark mode from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true)
      document.documentElement.classList.add("dark")
    }
  }, [])

  // Toggle dark mode and save preference
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    if (!isDarkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header with title and dark mode toggle */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">Weather & Air Quality</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Real-time weather data and AQI predictions</p>
          </div>

          {/* Dark mode toggle button */}
          <Button
            variant="outline"
            size="icon"
            onClick={toggleDarkMode}
            className="rounded-full"
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 pb-8 space-y-8">
        {/* Current Weather Section */}
        <WeatherSection />

        {/* Air Quality Prediction Section */}
        <AirQualitySection />

        {/* AQI Information Section */}
        <AQIInfoSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}

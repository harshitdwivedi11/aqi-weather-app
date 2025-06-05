"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Search, MapPin, Thermometer, Droplets, Wind, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getWeatherData, getCurrentLocation } from "@/utils/api"
import type { WeatherData } from "@/types"

export default function WeatherSection() {
  // State management for weather data and UI
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [city, setCity] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Load weather data for user's current location on component mount
  useEffect(() => {
    handleGetCurrentLocation()
  }, [])

  // Handle city search
  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!city.trim()) return

    setLoading(true)
    setError("")

    try {
      const data = await getWeatherData(city)
      setWeatherData(data)
    } catch (err) {
      setError("Failed to fetch weather data. Please check the city name and try again.")
      console.error("Weather fetch error:", err)
    } finally {
      setLoading(false)
    }
  }

  // Get user's current location and fetch weather
  const handleGetCurrentLocation = async () => {
    setLoading(true)
    setError("")

    try {
      const position = await getCurrentLocation()
      const data = await getWeatherData(`${position.latitude},${position.longitude}`)
      setWeatherData(data)
    } catch (err) {
      setError("Failed to get current location or weather data.")
      console.error("Location/Weather error:", err)
    } finally {
      setLoading(false)
    }
  }

  // Get weather icon URL
  const getWeatherIcon = (iconCode: string) => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Thermometer className="h-5 w-5" />
          Current Weather
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search form */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            <Search className="h-4 w-4" />
          </Button>
          <Button type="button" variant="outline" onClick={handleGetCurrentLocation} disabled={loading}>
            <MapPin className="h-4 w-4" />
          </Button>
        </form>

        {/* Error message */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        )}

        {/* Weather data display */}
        {weatherData && !loading && (
          <div className="space-y-4">
            {/* Location and main weather info */}
            <div className="text-center space-y-2">
              <h3 className="text-xl font-semibold">{weatherData.location}</h3>
              <div className="flex items-center justify-center gap-4">
                <img
                  src={getWeatherIcon(weatherData.icon) || "/placeholder.svg"}
                  alt={weatherData.condition}
                  className="w-16 h-16"
                />
                <div>
                  <div className="text-3xl font-bold">{weatherData.temperature}°C</div>
                  <div className="text-gray-600 dark:text-gray-400 capitalize">{weatherData.condition}</div>
                </div>
              </div>
            </div>

            {/* Weather details grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg text-center">
                <Thermometer className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                <div className="text-sm text-gray-600 dark:text-gray-400">Feels Like</div>
                <div className="font-semibold">{weatherData.feelsLike}°C</div>
              </div>

              <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded-lg text-center">
                <Droplets className="h-5 w-5 mx-auto mb-1 text-green-600" />
                <div className="text-sm text-gray-600 dark:text-gray-400">Humidity</div>
                <div className="font-semibold">{weatherData.humidity}%</div>
              </div>

              <div className="bg-purple-50 dark:bg-purple-900/20 p-3 rounded-lg text-center">
                <Wind className="h-5 w-5 mx-auto mb-1 text-purple-600" />
                <div className="text-sm text-gray-600 dark:text-gray-400">Wind Speed</div>
                <div className="font-semibold">{weatherData.windSpeed} m/s</div>
              </div>

              <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg text-center">
                <Eye className="h-5 w-5 mx-auto mb-1 text-orange-600" />
                <div className="text-sm text-gray-600 dark:text-gray-400">Visibility</div>
                <div className="font-semibold">{weatherData.visibility} km</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

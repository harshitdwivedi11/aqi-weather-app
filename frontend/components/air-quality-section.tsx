"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Activity, TrendingUp, History } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { predictAQI } from "@/utils/api"
import type { AQIPrediction, PredictionHistory } from "@/types"

export default function AirQualitySection() {
  // State management
  const [pm25Value, setPm25Value] = useState("")
  const [prediction, setPrediction] = useState<AQIPrediction | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [history, setHistory] = useState<PredictionHistory[]>([])

  // Load prediction history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem("aqiPredictionHistory")
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory))
    }
  }, [])

  // Handle AQI prediction
  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault()

    const pm25 = Number.parseFloat(pm25Value)
    if (isNaN(pm25) || pm25 < 0) {
      setError("Please enter a valid PM2.5 value (≥ 0)")
      return
    }

    setLoading(true)
    setError("")

    try {
      const result = await predictAQI(pm25)
      setPrediction(result)

      // Add to history
      const newHistoryItem: PredictionHistory = {
        id: Date.now().toString(),
        pm25: pm25,
        aqi: result.aqi,
        category: result.category,
        timestamp: new Date().toISOString(),
      }

      const updatedHistory = [newHistoryItem, ...history].slice(0, 10) // Keep last 10 predictions
      setHistory(updatedHistory)
      localStorage.setItem("aqiPredictionHistory", JSON.stringify(updatedHistory))
    } catch (err) {
      setError("Failed to predict AQI. Please try again.")
      console.error("AQI prediction error:", err)
    } finally {
      setLoading(false)
    }
  }

  // Get AQI category color and health message
  const getAQIInfo = (category: string) => {
    const aqiCategories = {
      Good: { color: "bg-green-500", textColor: "text-green-700", message: "Air quality is satisfactory" },
      Moderate: {
        color: "bg-yellow-500",
        textColor: "text-yellow-700",
        message: "Air quality is acceptable for most people",
      },
      "Unhealthy for Sensitive Groups": {
        color: "bg-orange-500",
        textColor: "text-orange-700",
        message: "Sensitive individuals may experience minor issues",
      },
      Unhealthy: { color: "bg-red-500", textColor: "text-red-700", message: "Everyone may experience health effects" },
      "Very Unhealthy": {
        color: "bg-purple-500",
        textColor: "text-purple-700",
        message: "Health alert: everyone may experience serious effects",
      },
      Hazardous: {
        color: "bg-red-800",
        textColor: "text-red-900",
        message: "Emergency conditions: entire population affected",
      },
    }

    return aqiCategories[category as keyof typeof aqiCategories] || aqiCategories["Good"]
  }

  // Clear prediction history
  const clearHistory = () => {
    setHistory([])
    localStorage.removeItem("aqiPredictionHistory")
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* AQI Prediction Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Air Quality Prediction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Input form */}
          <form onSubmit={handlePredict} className="space-y-4">
            <div>
              <label htmlFor="pm25" className="block text-sm font-medium mb-2">
                PM2.5 Value (μg/m³)
              </label>
              <Input
                id="pm25"
                type="number"
                step="0.1"
                min="0"
                placeholder="Enter PM2.5 value..."
                value={pm25Value}
                onChange={(e) => setPm25Value(e.target.value)}
                required
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Predicting...
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Predict AQI
                </>
              )}
            </Button>
          </form>

          {/* Error message */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Prediction result */}
          {prediction && (
            <div className="space-y-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800 dark:text-white">{prediction.aqi}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">AQI Value</div>
              </div>

              <div className="flex justify-center">
                <Badge className={`${getAQIInfo(prediction.category).color} text-white px-3 py-1`}>
                  {prediction.category}
                </Badge>
              </div>

              <div className={`text-center text-sm ${getAQIInfo(prediction.category).textColor}`}>
                {getAQIInfo(prediction.category).message}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Prediction History Card */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Prediction History
            </CardTitle>
            {history.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearHistory}>
                Clear
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400 py-8">
              No predictions yet. Make your first prediction above!
            </div>
          ) : (
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <div>
                    <div className="font-medium">PM2.5: {item.pm25} μg/m³</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(item.timestamp).toLocaleString()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-lg">AQI: {item.aqi}</div>
                    <Badge className={`${getAQIInfo(item.category).color} text-white text-xs`}>{item.category}</Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

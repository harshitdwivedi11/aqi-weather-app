// API utility functions for weather data and AQI predictions

import type { WeatherData, AQIPrediction, GeolocationPosition } from "@/types"

// OpenWeatherMap API configuration
const WEATHER_API_KEY = "your_openweathermap_api_key" // Replace with your actual API key
const WEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5"

/**
 * Fetch weather data for a given city or coordinates
 * @param query - City name or "lat,lon" coordinates
 * @returns Promise<WeatherData>
 */
export async function getWeatherData(query: string): Promise<WeatherData> {
  try {
    let url: string

    // Check if query contains coordinates (lat,lon format)
    if (query.includes(",")) {
      const [lat, lon] = query.split(",")
      url = `${WEATHER_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`
    } else {
      url = `${WEATHER_BASE_URL}/weather?q=${encodeURIComponent(query)}&appid=${WEATHER_API_KEY}&units=metric`
    }

    const response = await fetch(url)

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`)
    }

    const data = await response.json()

    // Transform API response to our WeatherData type
    return {
      location: `${data.name}, ${data.sys.country}`,
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      condition: data.weather[0].description,
      icon: data.weather[0].icon,
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 10) / 10, // Round to 1 decimal
      visibility: Math.round(data.visibility / 1000), // Convert meters to kilometers
    }
  } catch (error) {
    console.error("Error fetching weather data:", error)

    // Return mock data for demo purposes when API fails
    return {
      location: "Demo City",
      temperature: 22,
      feelsLike: 25,
      condition: "partly cloudy",
      icon: "02d",
      humidity: 65,
      windSpeed: 3.2,
      visibility: 10,
    }
  }
}

/**
 * Get user's current geolocation
 * @returns Promise<GeolocationPosition>
 */
export function getCurrentLocation(): Promise<GeolocationPosition> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by this browser"))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      },
      (error) => {
        reject(new Error(`Geolocation error: ${error.message}`))
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      },
    )
  })
}

/**
 * Predict AQI based on PM2.5 value
 * @param pm25 - PM2.5 concentration in μg/m³
 * @returns Promise<AQIPrediction>
 */
export async function predictAQI(pm25: number): Promise<AQIPrediction> {
  try {
    // Make POST request to backend prediction endpoint
    const response = await fetch("/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pm25 }),
    })

    if (!response.ok) {
      throw new Error(`Prediction API error: ${response.status}`)
    }

    const data = await response.json()
    return data
  } catch (error) {
    console.error("Error predicting AQI:", error)

    // Fallback: Calculate AQI using standard EPA formula for demo purposes
    const aqi = calculateAQIFromPM25(pm25)
    const category = getAQICategory(aqi)

    return { aqi, category }
  }
}

/**
 * Calculate AQI from PM2.5 using EPA formula (fallback function)
 * @param pm25 - PM2.5 concentration in μg/m³
 * @returns AQI value
 */
function calculateAQIFromPM25(pm25: number): number {
  // EPA AQI breakpoints for PM2.5
  const breakpoints = [
    { cLow: 0, cHigh: 12, aqiLow: 0, aqiHigh: 50 },
    { cLow: 12.1, cHigh: 35.4, aqiLow: 51, aqiHigh: 100 },
    { cLow: 35.5, cHigh: 55.4, aqiLow: 101, aqiHigh: 150 },
    { cLow: 55.5, cHigh: 150.4, aqiLow: 151, aqiHigh: 200 },
    { cLow: 150.5, cHigh: 250.4, aqiLow: 201, aqiHigh: 300 },
    { cLow: 250.5, cHigh: 500.4, aqiLow: 301, aqiHigh: 500 },
  ]

  // Find the appropriate breakpoint
  let breakpoint = breakpoints[breakpoints.length - 1] // Default to highest range

  for (const bp of breakpoints) {
    if (pm25 >= bp.cLow && pm25 <= bp.cHigh) {
      breakpoint = bp
      break
    }
  }

  // Calculate AQI using linear interpolation
  const { cLow, cHigh, aqiLow, aqiHigh } = breakpoint
  const aqi = ((aqiHigh - aqiLow) / (cHigh - cLow)) * (pm25 - cLow) + aqiLow

  return Math.round(aqi)
}

/**
 * Get AQI category based on AQI value
 * @param aqi - AQI value
 * @returns AQI category string
 */
function getAQICategory(aqi: number): string {
  if (aqi <= 50) return "Good"
  if (aqi <= 100) return "Moderate"
  if (aqi <= 150) return "Unhealthy for Sensitive Groups"
  if (aqi <= 200) return "Unhealthy"
  if (aqi <= 300) return "Very Unhealthy"
  return "Hazardous"
}

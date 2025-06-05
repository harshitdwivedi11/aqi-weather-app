// TypeScript type definitions for the Weather & AQI application

/**
 * Weather data structure returned by the weather API
 */
export interface WeatherData {
  location: string
  temperature: number
  feelsLike: number
  condition: string
  icon: string
  humidity: number
  windSpeed: number
  visibility: number
}

/**
 * AQI prediction result structure
 */
export interface AQIPrediction {
  aqi: number
  category: string
}

/**
 * Geolocation position coordinates
 */
export interface GeolocationPosition {
  latitude: number
  longitude: number
}

/**
 * Prediction history item for local storage
 */
export interface PredictionHistory {
  id: string
  pm25: number
  aqi: number
  category: string
  timestamp: string
}

/**
 * AQI category information with styling and health data
 */
export interface AQICategory {
  category: string
  range: string
  color: string
  textColor: string
  description: string
  healthAdvice: string
}

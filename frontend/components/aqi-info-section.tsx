"use client"

import { Info, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AQIInfoSection() {
  // AQI categories with their ranges, colors, and health implications
  const aqiCategories = [
    {
      category: "Good",
      range: "0-50",
      color: "bg-green-500",
      textColor: "text-green-700",
      description: "Air quality is satisfactory, and air pollution poses little or no risk.",
      healthAdvice: "Enjoy outdoor activities!",
    },
    {
      category: "Moderate",
      range: "51-100",
      color: "bg-yellow-500",
      textColor: "text-yellow-700",
      description: "Air quality is acceptable. However, there may be a risk for some people.",
      healthAdvice: "Unusually sensitive people should consider limiting outdoor activities.",
    },
    {
      category: "Unhealthy for Sensitive Groups",
      range: "101-150",
      color: "bg-orange-500",
      textColor: "text-orange-700",
      description: "Members of sensitive groups may experience health effects.",
      healthAdvice: "Sensitive groups should limit outdoor activities.",
    },
    {
      category: "Unhealthy",
      range: "151-200",
      color: "bg-red-500",
      textColor: "text-red-700",
      description: "Some members of the general public may experience health effects.",
      healthAdvice: "Everyone should limit outdoor activities.",
    },
    {
      category: "Very Unhealthy",
      range: "201-300",
      color: "bg-purple-500",
      textColor: "text-purple-700",
      description: "Health alert: The risk of health effects is increased for everyone.",
      healthAdvice: "Everyone should avoid outdoor activities.",
    },
    {
      category: "Hazardous",
      range: "301+",
      color: "bg-red-800",
      textColor: "text-red-900",
      description: "Emergency conditions: everyone is more likely to be affected.",
      healthAdvice: "Everyone should avoid all outdoor activities.",
    },
  ]

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* AQI Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            AQI Categories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {aqiCategories.map((category, index) => (
              <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <Badge className={`${category.color} text-white`}>{category.category}</Badge>
                  <span className="text-sm font-mono bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                    {category.range}
                  </span>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400">{category.description}</p>

                <div className={`text-xs ${category.textColor} font-medium`}>💡 {category.healthAdvice}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Information About AQI and PM2.5 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Understanding AQI & PM2.5
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* AQI Explanation */}
          <div>
            <h4 className="font-semibold text-lg mb-2">What is AQI?</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              The Air Quality Index (AQI) is a standardized way to communicate air quality to the public. It translates
              complex air quality data into a simple numerical scale from 0 to 500, where higher values indicate worse
              air quality and greater health concerns.
            </p>
          </div>

          {/* PM2.5 Explanation */}
          <div>
            <h4 className="font-semibold text-lg mb-2">What is PM2.5?</h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              PM2.5 refers to particulate matter with a diameter of 2.5 micrometers or smaller. These tiny particles can
              penetrate deep into the lungs and even enter the bloodstream, making them particularly harmful to human
              health. Common sources include vehicle emissions, industrial processes, and wildfires.
            </p>
          </div>

          {/* Health Impact */}
          <div>
            <h4 className="font-semibold text-lg mb-2">Health Impact</h4>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Short-term: Eye irritation, coughing, shortness of breath</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Long-term: Heart disease, lung cancer, respiratory diseases</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-red-500 mt-1">•</span>
                <span>Vulnerable groups: Children, elderly, people with asthma</span>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
            <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-2">💡 Protection Tips</h4>
            <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
              <li>• Check AQI before outdoor activities</li>
              <li>• Use air purifiers indoors when AQI is high</li>
              <li>• Wear N95 masks during poor air quality days</li>
              <li>• Keep windows closed when outdoor air quality is poor</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

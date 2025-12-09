"use client"

import { useState, useEffect } from "react"
import { getWeather, type WeatherData } from "@/utils/getWeather"

import SearchBox from "@/components/SearchBox"   // ✅ replaced SearchBar
import CurrentWeather from "@/components/current-weather"
import ForecastCards from "@/components/forecast-cards"
import AIGuideSection from "@/components/ai-guide-section"
import TwentyFourHourChart from "@/components/twenty-four-hour-chart"
import WeatherPersonalityCard from "@/components/weather-personality-card"

export default function WeatherDashboard() {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentCity, setCurrentCity] = useState("New York")
  const [suggestions, setSuggestions] = useState<string[] | null>(null)   // ✅ NEW state

  // 🔥 Combined search: autocomplete + auto-correct
  async function fetchWeather(city: string) {
    setLoading(true)
    setSuggestions(null)

    const res = await fetch(`/api/weather?city=${city}`)
    const data = await res.json()

    // ❗ If backend returns city_not_found → show suggestions
    if (data.error === "city_not_found") {
      setWeatherData(null)
      setSuggestions(data.suggestions)
      setLoading(false)
      return
    }

    // Valid weather response
    setWeatherData(data)
    setCurrentCity(city)
    setLoading(false)
  }

  useEffect(() => {
    fetchWeather(currentCity)
  }, [])

  // Background selection
  const getBackgroundImage = () => {
    if (!weatherData) return "/images/default.jpg"

    const desc = weatherData.description.toLowerCase()

    if (desc.includes("clear")) return "/images/clear.jpg"
    if (desc.includes("few clouds")) return "/images/few_clouds.jpg"
    if (desc.includes("scattered clouds")) return "/images/scattered_clouds.jpg"
    if (desc.includes("broken clouds")) return "/images/broken_clouds.jpg"
    if (desc.includes("overcast")) return "/images/overcast.jpg"
    if (desc.includes("freezing rain")) return "/images/freezing_rain.jpg"
    if (desc.includes("light rain")) return "/images/light_rain.jpg"
    if (desc.includes("moderate rain")) return "/images/moderate_rain.jpg"
    if (desc.includes("heavy rain")) return "/images/heavy_rain.jpg"
    if (desc.includes("rain")) return "/images/rainy.jpg"
    if (desc.includes("drizzle")) return "/images/drizzle.jpg"
    if (desc.includes("thunderstorm")) return "/images/thunderstorm.jpg"
    if (desc.includes("light snow")) return "/images/light_snow.jpg"
    if (desc.includes("heavy snow")) return "/images/heavy_snow.jpg"
    if (desc.includes("snow")) return "/images/snow.jpg"
    if (desc.includes("sleet")) return "/images/sleet.jpg"
    if (
      desc.includes("fog") ||
      desc.includes("mist") ||
      desc.includes("haze") ||
      desc.includes("smoke") ||
      desc.includes("dust") ||
      desc.includes("sand")
    ) return "/images/fog.jpg"

    if (desc.includes("tornado") || desc.includes("squall"))
      return "/images/extreme.jpg"

    return "/images/default.jpg"
  }

  // Temporary 24-hour temperature generator
  const generate24HourData = () => {
    const list = []
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, "0") + ":00"
      const temp = Math.floor(15 + Math.sin(i / 4) * 8 + Math.random() * 3)
      list.push({ time: hour, temp })
    }
    return list
  }

  const hourlyData = generate24HourData()

  const guideForUI = weatherData
    ? {
        summary: weatherData.ai_guide.summary,
        safety: weatherData.ai_guide.safety,
        insight: weatherData.ai_guide.insight,
      }
    : null

  return (
    <main
      className="min-h-screen bg-cover bg-center bg-no-repeat transition-all duration-1000 p-6"
      style={{ backgroundImage: `url(${getBackgroundImage()})` }}
    >
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <h1 className="text-4xl font-bold text-white drop-shadow-lg mb-6">
          🌍 Climocast
        </h1>

        {/* 🔥 Combined Search Box */}
        <SearchBox onSearch={fetchWeather} />
      </div>

      {/* ❗ Auto-correct suggestion UI */}
      {suggestions && (
        <div className="max-w-7xl mx-auto text-white mb-6">
          <p className="text-lg mb-2">Did you mean:</p>
          <div className="flex gap-3 flex-wrap">
            {suggestions.map((city) => (
              <button
                key={city}
                onClick={() => fetchWeather(city)}
                className="px-4 py-2 bg-white/20 rounded-lg backdrop-blur hover:bg-white/30"
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <div className="max-w-7xl mx-auto animate-pulse space-y-6">
          <div className="h-64 bg-white/20 rounded-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="h-40 bg-white/20 rounded-2xl" />
            <div className="h-40 bg-white/20 rounded-2xl" />
            <div className="h-40 bg-white/20 rounded-2xl" />
          </div>
        </div>
      ) : weatherData ? (
        <div className="max-w-7xl mx-auto space-y-10">
          {/* MAIN GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <CurrentWeather data={weatherData} />
            </div>

            <div className="lg:col-span-2 flex flex-col gap-8">
              <div className="w-full">
                <ForecastCards forecast={weatherData.forecast} />
              </div>

              <div className="w-full">
                <TwentyFourHourChart data={hourlyData} />
              </div>

              <div className="w-full">
                <WeatherPersonalityCard
                  city={currentCity}
                  temp={weatherData.temp}
                  category={weatherData.description}
                  wind={weatherData.wind_speed}
                  humidity={weatherData.humidity}
                />
              </div>
            </div>
          </div>

          {/* AI GUIDE */}
          {guideForUI && <AIGuideSection guide={guideForUI} />}
        </div>
      ) : (
        <div className="max-w-7xl mx-auto text-white text-center text-xl">
          Could not load weather data.
        </div>
      )}
    </main>
  )
}

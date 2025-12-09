"use client"

interface WeatherPersonalityCardProps {
  city: string
  temp: number
  category: string
  wind: number
  humidity: number
  mood?: string              // ⭐ NEW
  aqi?: number               // ⭐ NEW
  aqi_label?: string         // ⭐ NEW
}

export default function WeatherPersonalityCard({
  city,
  temp,
  category,
  wind,
  humidity,
  mood,
  aqi,
  aqi_label
}: WeatherPersonalityCardProps) {

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 p-6 text-white space-y-2 transition-all duration-300 hover:bg-white/20 hover:translate-y-[-4px]">
      
      <h4 className="text-white font-bold text-xl tracking-wide mb-3 bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent drop-shadow-lg">
        {city}'s Mood
      </h4>

      {/* ⭐ Use backend mood instead of local logic */}
      <p className="text-sm leading-relaxed text-white/90 italic font-light">
        {mood ?? `${city} feels balanced today.`}
      </p>

      {/* ⭐ Weather stats */}
      <div className="pt-2 flex gap-4 text-xs text-white/70">
        <span>🌡️ {temp}°C</span>
        <span>💨 {wind} km/h</span>
        <span>💧 {humidity}%</span>
      </div>

      {/* ⭐ NEW — Air Quality */}
      {aqi && aqi_label && (
        <div className="pt-2 text-xs text-white/80">
          <span>🌫️ AQI: {aqi} — {aqi_label}</span>
        </div>
      )}
    </div>
  )
}

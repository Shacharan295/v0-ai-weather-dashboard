// 🌍 BACKEND URL (Render Flask API)
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://weather-backend-e8cz.onrender.com"

// ⭐ Convert backend description → emoji (FULLY FIXED)
function getEmoji(desc: string) {
  const d = desc.toLowerCase()

  // ☀️ CLEAR
  if (d.includes("clear")) return "☀️"

  // 🌤️ FEW CLOUDS
  if (d.includes("few clouds")) return "🌤️"

  // ⛅ SCATTERED CLOUDS
  if (d.includes("scattered clouds")) return "⛅"

  // 🌥️ BROKEN CLOUDS
  if (d.includes("broken clouds")) return "🌥️"

  // ☁️ OVERCAST
  if (d.includes("overcast")) return "☁️"

  // ☁️ ANY CLOUDS
  if (d.includes("cloud")) return "☁️"

  // 🌦️ LIGHT RAIN
  if (d.includes("light rain")) return "🌦️"

  // 🌧️ MODERATE / HEAVY RAIN
  if (d.includes("moderate rain") || d.includes("heavy rain")) return "🌧️"

  // 🌧️ ANY RAIN
  if (d.includes("rain")) return "🌧️"

  // ⛈️ THUNDER
  if (d.includes("thunder")) return "⛈️"

  // 🌨️ LIGHT SNOW
  if (d.includes("light snow")) return "🌨️"

  // ❄️ SNOW
  if (d.includes("snow")) return "❄️"

  // 🌫️ Mist / Fog / Haze
  if (d.includes("fog") || d.includes("mist") || d.includes("haze"))
    return "🌫️"

  // Default
  return "🌡️"
}

export async function getWeather(city: string) {
  try {
    const res = await fetch(
      `${BACKEND_URL}/weather?city=${encodeURIComponent(city)}`,
      { cache: "no-store" }
    )

    if (!res.ok) throw new Error("Backend failed")

    const data = await res.json()

    return {
      city: data.city,
      country: data.country,
      temp: data.temp,
      feels_like: data.feels_like,
      description: data.description,
      humidity: data.humidity,
      wind_speed: data.wind_speed,
      pressure: data.pressure,
      wind_mood: data.wind_mood,
      local_time: data.local_time,

      // ⭐ FORECAST ARRAY (FULL FIX: uses desc + emoji)
      forecast: (data.forecast || []).map((f: any) => ({
        day: f.day,
        temp: f.temp,
        desc: f.description,
        emoji: getEmoji(f.description),
      })),

      // ⭐ AI GUIDE (kept same)
      ai_guide: {
        morning: data.ai_guide.morning ?? null,
        afternoon: data.ai_guide.afternoon ?? null,
        evening: data.ai_guide.evening ?? null,
        activity: data.ai_guide.activities ?? null,
        clothing: data.ai_guide.clothing ?? null,

        summary: data.ai_guide.summary,
        safety: data.ai_guide.safety,
        insight: data.ai_guide.insight,
      },
    }
  } catch (error) {
    console.error("[getWeather] Failed:", error)
    return null
  }
}

// 🌍 BACKEND URL (Render Flask API)
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://weather-backend-e8cz.onrender.com"

// ⭐ Convert backend description → emoji
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

  // ☁️ OVERCAST CLOUDS
  if (d.includes("overcast")) return "☁️"

  // 🌧️ LIGHT RAIN
  if (d.includes("light rain")) return "🌦️"

  // 🌧️ MODERATE / HEAVY RAIN
  if (d.includes("moderate rain") || d.includes("heavy rain")) return "🌧️"

  // ⛈️ THUNDERSTORM
  if (d.includes("thunder")) return "⛈️"

  // ❄️ SNOW TYPES
  if (d.includes("light snow")) return "🌨️"
  if (d.includes("snow")) return "❄️"

  // 🌫️ FOG / MIST / HAZE
  if (d.includes("fog") || d.includes("mist") || d.includes("haze")) return "🌫️"

  // DEFAULT
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

    // ⭐ Return SAME frontend structure (no UI changes needed)
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

      forecast: (data.forecast || []).map((f: any) => ({
        day: f.day,
        temp: f.temp,
        desc: f.description,
        emoji: getEmoji(f.description),
      })),

      // ⭐ FRONTEND FORMAT KEPT EXACT SAME
      // ⭐ Missing backend fields safely mapped to null
      ai_guide: {
        morning: data.ai_guide.morning ?? null,
        afternoon: data.ai_guide.afternoon ?? null,
        evening: data.ai_guide.evening ?? null,
        activity: data.ai_guide.activities ?? null,
        clothing: data.ai_guide.clothing ?? null,

        // ⭐ THESE THREE COME FROM BACKEND
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

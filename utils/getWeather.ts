// 🌍 BACKEND URL (Render Flask API)
const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  "https://weather-backend-e8cz.onrender.com"

// ⭐ Convert backend description → emoji
function getEmoji(desc: string) {
  const d = desc.toLowerCase()
  if (d.includes("sun") || d.includes("clear")) return "☀️"
  if (d.includes("cloud")) return "☁️"
  if (d.includes("rain")) return "🌧️"
  if (d.includes("storm")) return "⛈️"
  if (d.includes("snow")) return "❄️"
  if (d.includes("fog") || d.includes("mist") || d.includes("haze")) return "🌫️"
  return "🌡️"
}

export async function getWeather(city: string) {
  try {
    // ⭐ ALWAYS call backend first (worldwide accurate data)
    const res = await fetch(
      `${BACKEND_URL}/weather?city=${encodeURIComponent(city)}`,
      { cache: "no-store" }
    )

    if (!res.ok) {
      throw new Error("Backend failed")
    }

    const data = await res.json()

    // ⭐ Map backend data → UI structure
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

      ai_guide: {
        morning: data.ai_guide.morning,
        afternoon: data.ai_guide.afternoon,
        evening: data.ai_guide.evening,
        safety: data.ai_guide.safety,
        activity: data.ai_guide.activities,
        summary: data.ai_guide.summary,
        clothing: data.ai_guide.clothing,
      },
    }
  } catch (error) {
    console.error("[getWeather] Failed:", error)
    return null
  }
}

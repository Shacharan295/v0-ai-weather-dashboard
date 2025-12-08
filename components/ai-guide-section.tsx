"use client"

interface AIGuideData {
  summary: string
  safety: string
  insight: string
}

interface AIGuideSectionProps {
  guide: AIGuideData
}

const guides = [
  { title: "Cast Today", key: "summary" as const },
  { title: "Safety Today", key: "safety" as const },
  { title: "Climate Insight", key: "insight" as const },
]

export default function AIGuideSection({ guide }: AIGuideSectionProps) {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6 drop-shadow-lg">
        💡 AI Weather Guide
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {guides.map((item) => (
          <div
            key={item.key}
            className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/30 
            hover:bg-white/20 transition-all duration-300 transform hover:translate-y-[-4px]"
          >
            <h3 className="text-white font-bold mb-3">{item.title}</h3>

            {/* FIX: allow long text to wrap correctly */}
            <p className="text-white/80 text-sm leading-relaxed whitespace-pre-wrap break-words">
              {guide[item.key]}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

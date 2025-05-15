"use client"

import { trackButtonClick } from "@/utils/tracking"

interface NotQualifiedResultProps {
  onExploreClick: () => void
}

export default function NotQualifiedResult({ onExploreClick }: NotQualifiedResultProps) {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="border-0 shadow-lg overflow-hidden mb-6 rounded-lg">
        <div className="bg-gradient-to-r from-red-600 to-red-700 p-3 text-white text-center">
          <h3 className="text-xl font-bold">Not Qualified</h3>
        </div>

        <div className="p-4 text-center">
          <h4 className="text-xl font-bold text-center mb-4">
            We're sorry, but based on your answers, you don't qualify for this specific Medicare benefit.
          </h4>

          <p className="mb-4 text-lg">
            There may be other Medicare benefits available to you. Please consult with a Medicare specialist for more
            information.
          </p>

          <button
            onClick={(e) => {
              trackButtonClick("form", "explore_other_benefits", { result: "not_qualified" })
              onExploreClick()
            }}
            className="bg-blue-800 hover:bg-blue-900 text-white font-bold py-5 px-8 rounded-md text-lg shadow-lg mt-2"
          >
            Explore Other Benefits
          </button>
        </div>
      </div>
    </div>
  )
}

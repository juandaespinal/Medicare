"use client"

interface MedicareQuestionProps {
  onMedicareSelect: (option: string) => void
}

export default function MedicareQuestion({ onMedicareSelect }: MedicareQuestionProps) {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="border-0 shadow-2xl overflow-hidden mb-6 rounded-lg">
        <div className="bg-gradient-to-r from-blue-700 to-blue-900 p-4 text-white text-center">
          <h3 className="text-2xl font-bold">Medicare Benefits Eligibility Check</h3>
          <p className="text-blue-100 mt-1">Please answer the following questions to check your eligibility</p>
        </div>

        <div className="p-6 bg-gray-50">
          <div className="mb-6">
            {/* Progress indicator */}
            <div className="flex justify-center items-center mb-4">
              <div className="w-full max-w-xs bg-gray-200 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-600 h-full rounded-full" style={{ width: "100%" }}></div>
              </div>
              <span className="ml-3 text-gray-600 font-medium">Step 2/2</span>
            </div>

            {/* Question */}
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100 mb-5">
              <h4 className="text-3xl font-bold text-center mb-2 text-gray-800">Are you on Medicare Parts A and B?</h4>
              <p className="text-center text-gray-500 mb-4">Please select one option below</p>
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <button
                className="flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-8 px-4 rounded-lg text-2xl shadow-md transition-all duration-200 hover:shadow-lg border-2 border-blue-300 option-pulse"
                onClick={() => onMedicareSelect("Yes")}
              >
                <span>Yes</span>
              </button>
              <button
                className="flex flex-col items-center justify-center bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-8 px-4 rounded-lg text-2xl shadow-md transition-all duration-200 hover:shadow-lg border-2 border-blue-300 option-pulse"
                onClick={() => onMedicareSelect("No")}
              >
                <span>No</span>
              </button>
            </div>
          </div>

          <div className="text-center text-gray-500 text-sm mt-4">
            <p>Your answers help us determine your eligibility for Medicare benefits</p>
          </div>
        </div>
      </div>
    </div>
  )
}

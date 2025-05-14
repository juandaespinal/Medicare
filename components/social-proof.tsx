interface SocialProofProps {
  amount?: string
}

export function SocialProof({ amount = "" }: SocialProofProps) {
  return (
    <div className="mt-6 mb-6 bg-white rounded-lg shadow-md p-5">
      <h3 className="text-center text-xl font-bold mb-4 text-blue-800">What Seniors Are Saying</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 shadow-sm">
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-lg mr-3">
              MT
            </div>
            <div>
              <div className="font-medium text-gray-800">Margaret T.</div>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
          <p className="text-base text-gray-700 italic">
            "This {amount ? `${amount} ` : ""}allowance has been a lifesaver! The process was so easy and the advisor
            was very helpful. I'm using it for my prescriptions and groceries every month."
          </p>
          <div className="mt-2 text-sm text-gray-500">Medicare recipient since 2018</div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 shadow-sm">
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-lg mr-3">
              RJ
            </div>
            <div>
              <div className="font-medium text-gray-800">Robert J.</div>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                  </svg>
                ))}
              </div>
            </div>
          </div>
          <p className="text-base text-gray-700 italic">
            "I had no idea I qualified for this benefit! Now I can shop at Walmart and CVS without worrying about my
            budget. It's made a huge difference for me."
          </p>
          <div className="mt-2 text-sm text-gray-500">Medicare recipient since 2020</div>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-green-50 p-3 rounded-lg border border-green-100 text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">98%</div>
          <div className="text-sm text-gray-700">Satisfaction Rate</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg border border-green-100 text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">24,000+</div>
          <div className="text-sm text-gray-700">Seniors Helped</div>
        </div>
        <div className="bg-green-50 p-3 rounded-lg border border-green-100 text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">{amount || "Valuable"}</div>
          <div className="text-sm text-gray-700">Benefits</div>
        </div>
      </div>
    </div>
  )
}

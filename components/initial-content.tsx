"use client"

interface InitialContentProps {
  allowanceAmount: string
  onClaimClick: () => void
}

export default function InitialContent({ allowanceAmount, onClaimClick }: InitialContentProps) {
  return (
    <div id="initial-content">
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-3 mb-4 text-sm sm:text-base">
        <div className="flex items-center">
          <svg
            className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500 mr-2"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <p className="font-medium text-yellow-700">
            <span className="font-bold">LIMITED TIME:</span> Only
            <span className="font-bold"> 37 spots left</span> today
          </p>
        </div>
      </div>

      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 px-2 leading-tight">
        Seniors: Claim Your $2,500 Grocery Allowance + $185 Monthly Bonus
      </h2>

      {/* Dual Benefits Cards - Side by Side with Larger Size */}
      <div className="my-4 grid grid-cols-2 gap-3 max-w-3xl mx-auto px-2">
        {/* Allowance Card */}
        <div className="relative">
          <div className="w-full relative">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Medicare%20Allowance%20Card%20-%20Blue%20-%20Front%20%282%29-WrbyoEgWtLKm0CeySHiCGy2yfOnrDn.png"
              alt="Medicare Allowance Card"
              className="w-full h-auto rounded-lg shadow-lg"
            />
            <div className="absolute top-1 right-1 bg-red-600 text-white text-xs sm:text-sm font-bold py-1 px-2 rounded-br-lg rounded-tl-lg">
              $2,500 VALUE
            </div>
          </div>
          <div className="text-center mt-2">
            <p className="text-sm sm:text-base font-medium">Grocery Allowance Card</p>
          </div>
        </div>

        {/* Social Security Check */}
        <div className="relative">
          <div className="w-full relative">
            <img
              src="/social-security-check-185.png"
              alt="$185 Monthly Social Security Bonus"
              className="w-full h-auto rounded-lg shadow-lg"
            />
            <div className="absolute top-1 right-1 bg-green-600 text-white text-xs sm:text-sm font-bold py-1 px-2 rounded-br-lg rounded-tl-lg">
              $185 MONTHLY
            </div>
          </div>
          <div className="text-center mt-2">
            <p className="text-sm sm:text-base font-medium">Social Security Bonus</p>
          </div>
        </div>
      </div>

      {/* Total Value Display - Larger for Seniors */}
      <div className="text-center mb-4 px-2">
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white p-4 rounded-lg max-w-md mx-auto">
          <p className="text-lg sm:text-xl font-bold">Total Annual Value: $4,720</p>
          <p className="text-sm sm:text-base opacity-90 mt-1">$2,500 Grocery + $2,220 SS Bonus</p>
        </div>
      </div>

      {/* Initial Claim Button - Larger for Seniors */}
      <div className="text-center px-3">
        <div className="mb-4 text-lg sm:text-xl font-bold text-red-600">Check Eligibility - Takes 30 Seconds!</div>

        <div className="relative">
          <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-30 rounded-2xl"></div>

          <button
            onClick={onClaimClick}
            className="relative w-full max-w-lg mx-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-8 sm:py-10 md:py-12 px-6 sm:px-8 md:px-10 rounded-xl text-xl sm:text-2xl md:text-3xl shadow-2xl transition-all duration-200 ease-in-out border-4 border-yellow-400 size-pulse"
          >
            <div className="absolute -right-2 -top-2 sm:-right-3 sm:-top-3 bg-yellow-400 text-red-700 text-sm sm:text-base font-bold px-3 py-1 rounded-full">
              FREE
            </div>
            <div className="flex items-center justify-center">
              <span>CLAIM NOW</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-3 h-7 w-7 sm:h-8 sm:w-8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </button>
        </div>

        <div className="mt-4 flex justify-center items-center text-sm sm:text-base text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>Your information is secure & confidential</span>
        </div>
      </div>

      {/* Benefits Section - Larger Text for Seniors */}
      <div className="flex justify-center mt-6 mb-6 px-3">
        <div className="bg-green-100 rounded-lg p-4 sm:p-5 max-w-lg shadow-md border border-green-200 w-full">
          <h3 className="font-bold text-center text-lg sm:text-xl mb-4 text-green-800">What Your Benefits Cover:</h3>
          <ul className="list-none space-y-3 text-base sm:text-lg">
            <li className="flex items-start bg-white p-3 rounded-md shadow-sm">
              <svg
                className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 mr-3 mt-1 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>
                <span className="font-bold">$2,500 Groceries</span> at Walmart, Target & more
              </span>
            </li>
            <li className="flex items-start bg-white p-3 rounded-md shadow-sm">
              <svg
                className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 mr-3 mt-1 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>
                <span className="font-bold">$185 Monthly</span> Social Security bonus
              </span>
            </li>
            <li className="flex items-start bg-white p-3 rounded-md shadow-sm">
              <svg
                className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 mr-3 mt-1 flex-shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>
                <span className="font-bold">No cost</span> - Medicare covers 100%
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Social Proof Section - Larger Text for Seniors */}
      <div className="mt-8 mb-8 bg-white rounded-lg shadow-md p-4 sm:p-6 mx-3">
        <h3 className="text-center text-xl sm:text-2xl font-bold mb-5 text-blue-800">What Seniors Are Saying</h3>

        <div className="grid grid-cols-1 gap-5">
          <div className="bg-blue-50 p-4 sm:p-5 rounded-lg border border-blue-100 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-lg sm:text-xl mr-4 flex-shrink-0">
                MT
              </div>
              <div>
                <div className="font-medium text-gray-800 text-base sm:text-lg">Margaret T.</div>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-base sm:text-lg text-gray-700 italic leading-relaxed">
              "The $2,500 grocery allowance and $185 monthly bonus have been life-changing! The process was so easy and
              the advisor was very helpful."
            </p>
            <div className="mt-3 text-sm sm:text-base text-gray-500">Medicare recipient since 2018</div>
          </div>

          <div className="bg-blue-50 p-4 sm:p-5 rounded-lg border border-blue-100 shadow-sm">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 font-bold text-lg sm:text-xl mr-4 flex-shrink-0">
                RJ
              </div>
              <div>
                <div className="font-medium text-gray-800 text-base sm:text-lg">Robert J.</div>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 sm:w-5 sm:h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                    </svg>
                  ))}
                </div>
              </div>
            </div>
            <p className="text-base sm:text-lg text-gray-700 italic leading-relaxed">
              "I had no idea I qualified for both benefits! Now I get $185 extra each month plus the grocery allowance.
              Amazing!"
            </p>
            <div className="mt-3 text-sm sm:text-base text-gray-500">Medicare recipient since 2020</div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-100 text-center">
            <div className="text-xl sm:text-3xl font-bold text-green-600 mb-1">98%</div>
            <div className="text-sm sm:text-base text-gray-700">Satisfaction</div>
          </div>
          <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-100 text-center">
            <div className="text-xl sm:text-3xl font-bold text-green-600 mb-1">24K+</div>
            <div className="text-sm sm:text-base text-gray-700">Seniors Helped</div>
          </div>
          <div className="bg-green-50 p-3 sm:p-4 rounded-lg border border-green-100 text-center">
            <div className="text-xl sm:text-3xl font-bold text-green-600 mb-1">$4,720</div>
            <div className="text-sm sm:text-base text-gray-700">Avg Value</div>
          </div>
        </div>
      </div>

      {/* Bottom Claim Button - Larger for Seniors */}
      <div className="text-center mt-8 mb-6 px-3">
        <div className="mb-4 text-lg sm:text-xl font-bold text-red-600">Don't Miss This $4,720 Opportunity!</div>

        <div className="relative">
          <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-30 rounded-2xl"></div>

          <button
            onClick={onClaimClick}
            className="relative w-full max-w-lg mx-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-10 sm:py-12 md:py-14 px-6 sm:px-8 md:px-10 rounded-xl text-xl sm:text-2xl md:text-3xl shadow-2xl transition-all duration-200 ease-in-out border-4 border-yellow-400 size-pulse"
          >
            <div className="absolute -right-2 -top-2 sm:-right-3 sm:-top-3 bg-yellow-400 text-red-700 text-sm sm:text-base font-bold px-3 py-1 rounded-full">
              FREE
            </div>
            <div className="flex items-center justify-center">
              <span>CLAIM NOW</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-3 h-7 w-7 sm:h-8 sm:w-8"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 18l6-6-6-6" />
              </svg>
            </div>
          </button>
        </div>

        <div className="mt-4 flex justify-center items-center text-sm sm:text-base text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 sm:h-5 sm:w-5 mr-2"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
          <span>Your information is secure & confidential</span>
        </div>
      </div>
    </div>
  )
}

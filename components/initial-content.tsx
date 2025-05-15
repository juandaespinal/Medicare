"use client"

interface InitialContentProps {
  allowanceAmount: string
  onClaimClick: () => void
}

export default function InitialContent({ allowanceAmount, onClaimClick }: InitialContentProps) {
  return (
    <div id="initial-content">
      <div className="bg-yellow-100 border-l-4 border-yellow-500 p-2 mb-3 text-xs sm:text-sm">
        <div className="flex items-center">
          <svg
            className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500 mr-1"
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

      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4">
        Seniors: Claim Your {allowanceAmount} Now
      </h2>

      {/* Allowance Card */}
      <div className="my-4 relative">
        <div className="max-w-sm mx-auto relative">
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Medicare%20Allowance%20Card%20-%20Blue%20-%20Front%20%282%29-WrbyoEgWtLKm0CeySHiCGy2yfOnrDn.png"
            alt="Medicare Allowance Card"
            className="w-full h-auto rounded-xl shadow-lg"
          />
          <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold py-1 px-2 rounded-br-xl rounded-tl-xl">
            {allowanceAmount.includes("$") ? `${allowanceAmount.split(" ")[0]} VALUE` : "VALUABLE BENEFIT"}
          </div>
        </div>
        <div className="text-center mt-2">
          <p className="text-sm font-medium">The Medicare Allowance Card you'll receive</p>
          <p className="text-xs text-gray-600">Use at grocery stores, pharmacies & more</p>
        </div>
      </div>

      {/* Initial Claim Button */}
      <div className="text-center">
        <div className="mb-3 text-base font-bold text-red-600">Check Eligibility - Takes 30 Seconds!</div>

        <div className="relative">
          <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-30 rounded-2xl"></div>

          <button
            onClick={onClaimClick}
            className="relative w-full max-w-lg mx-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-12 sm:py-10 px-6 sm:px-10 rounded-xl text-2xl sm:text-3xl shadow-2xl transition-all duration-200 ease-in-out border-4 border-yellow-400 size-pulse"
          >
            <div className="absolute -right-3 -top-3 bg-yellow-400 text-red-700 text-sm font-bold px-2 py-1 rounded-full">
              FREE
            </div>
            <div className="flex items-center justify-center">
              <span>CLAIM NOW</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 h-8 w-8"
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

        <div className="mt-3 flex justify-center items-center text-sm text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1.5"
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

      {/* Benefits Section */}
      <div className="flex justify-center mt-5 mb-5">
        <div className="bg-green-100 rounded-lg p-4 max-w-md shadow-md border border-green-200 w-full">
          <h3 className="font-bold text-center text-lg mb-3 text-green-800">What Your {allowanceAmount} Covers:</h3>
          <ul className="list-none space-y-2 text-base">
            <li className="flex items-start bg-white p-2 rounded-md shadow-sm">
              <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>
                <span className="font-bold">Groceries</span> at Walmart, Target & more
              </span>
            </li>
            <li className="flex items-start bg-white p-2 rounded-md shadow-sm">
              <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>
                <span className="font-bold">Prescriptions</span> at CVS, Walgreens & others
              </span>
            </li>
            <li className="flex items-start bg-white p-2 rounded-md shadow-sm">
              <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>
                <span className="font-bold">No cost</span> - Medicare covers 100%
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Social Proof Section */}
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
              "This {allowanceAmount.toLowerCase()} has been a lifesaver! The process was so easy and the advisor was
              very helpful. I'm using it for my prescriptions and groceries every month."
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
            <div className="text-2xl font-bold text-green-600 mb-1">Valuable</div>
            <div className="text-sm text-gray-700">Benefits</div>
          </div>
        </div>
      </div>

      {/* Bottom Claim Button - Duplicate of the top button */}
      <div className="text-center mt-8 mb-4">
        <div className="mb-3 text-base font-bold text-red-600">Don't Miss This Opportunity!</div>

        <div className="relative">
          <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-30 rounded-2xl"></div>

          <button
            onClick={onClaimClick}
            className="relative w-full max-w-lg mx-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-bold py-12 sm:py-10 px-6 sm:px-10 rounded-xl text-2xl sm:text-3xl shadow-2xl transition-all duration-200 ease-in-out border-4 border-yellow-400 size-pulse"
          >
            <div className="absolute -right-3 -top-3 bg-yellow-400 text-red-700 text-sm font-bold px-2 py-1 rounded-full">
              FREE
            </div>
            <div className="flex items-center justify-center">
              <span>CLAIM NOW</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="ml-2 h-8 w-8"
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

        <div className="mt-3 flex justify-center items-center text-sm text-gray-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 mr-1.5"
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

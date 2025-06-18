interface BenefitsProps {
  amount?: string
}

export function Benefits({ amount = "" }: BenefitsProps) {
  return (
    <div className="flex justify-center mt-5 mb-5">
      <div className="bg-green-100 rounded-lg p-4 max-w-md shadow-md border border-green-200 w-full">
        <h3 className="font-bold text-center text-lg mb-3 text-green-800">
          What Your {amount ? `${amount} ` : ""}Allowance Covers:
        </h3>
        <ul className="list-none space-y-2 text-base">
          <li className="flex items-start bg-white p-2 rounded-md shadow-sm">
            <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>
              <span className="font-bold">Groceries</span> at Walmart, Target & more
            </span>
          </li>
          <li className="flex items-start bg-white p-2 rounded-md shadow-sm">
            <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>
              <span className="font-bold">Prescriptions</span> at CVS, Walgreens & others
            </span>
          </li>
          <li className="flex items-start bg-white p-2 rounded-md shadow-sm">
            <svg className="h-5 w-5 text-green-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span>
              <span className="font-bold">No cost</span> - Medicare covers 100%
            </span>
          </li>
        </ul>
      </div>
    </div>
  )
}

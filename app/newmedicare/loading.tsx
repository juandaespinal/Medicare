export default function Loading() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-red-800">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600 mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Loading...</h2>
          <p className="text-gray-500 mt-2">Please wait while we prepare your Medicare benefits information.</p>
        </div>
      </div>
    </div>
  )
}

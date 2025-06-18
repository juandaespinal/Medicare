import Image from "next/image"

interface AllowanceCardProps {
  amount?: string
}

export function AllowanceCard({ amount = "" }: AllowanceCardProps) {
  return (
    <div className="my-4 relative">
      <div className="max-w-sm mx-auto relative">
        <Image
          src="/allowance-card.png"
          alt="Medicare Allowance Card"
          width={600}
          height={300}
          className="w-full h-auto rounded-xl shadow-lg"
          priority
        />
        <div className="absolute top-0 right-0 bg-red-600 text-white text-xs font-bold py-1 px-2 rounded-br-xl rounded-tl-xl">
          {amount ? `${amount} VALUE` : "VALUABLE BENEFIT"}
        </div>
      </div>
      <div className="text-center mt-2">
        <p className="text-sm font-medium">The Medicare Allowance Card you'll receive</p>
        <p className="text-xs text-gray-600">Use at grocery stores, pharmacies & more</p>
      </div>
    </div>
  )
}

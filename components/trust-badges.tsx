import Image from "next/image"

export function TrustBadges() {
  return (
    <div className="mt-8">
      <div className="flex justify-center gap-4 mb-6">
        <div className="w-16 h-16 relative">
          <Image src="/satisfaction-badge.png" alt="100% Satisfaction" width={64} height={64} />
        </div>
        <div className="w-16 h-16 relative">
          <Image src="/approved-badge.png" alt="Medicare Approved" width={64} height={64} />
        </div>
        <div className="w-16 h-16 relative">
          <Image src="/quality-badge.png" alt="Quality Assured" width={64} height={64} />
        </div>
        <div className="w-16 h-16 relative">
          <Image src="/usa-badge.png" alt="Made in USA" width={64} height={64} />
        </div>
      </div>

      <div className="text-center mb-2">
        <p className="text-gray-700 font-medium">AS SEEN ON</p>
      </div>

      <div className="flex justify-center items-center gap-6">
        <div className="w-20 h-12 relative">
          <Image src="/cbs-logo.png" alt="CBS News" width={80} height={48} className="object-contain" />
        </div>
        <div className="w-20 h-12 relative">
          <Image src="/abc-logo.png" alt="ABC" width={80} height={48} className="object-contain" />
        </div>
        <div className="w-20 h-12 relative">
          <Image src="/nbc-logo.png" alt="NBC" width={80} height={48} className="object-contain" />
        </div>
        <div className="w-20 h-12 relative">
          <Image src="/fox-logo.png" alt="FOX" width={80} height={48} className="object-contain" />
        </div>
      </div>
    </div>
  )
}

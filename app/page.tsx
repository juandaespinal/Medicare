import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, Star } from "lucide-react"

export default function MedicareLandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-700 to-red-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-2xl">
        <CardContent className="p-6 space-y-6">
          {/* Limited Time Banner */}
          <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-yellow-600" />
            <div className="text-sm">
              <span className="font-semibold text-yellow-800">LIMITED TIME:</span>
              <span className="text-yellow-700"> Only 37 spots left today</span>
            </div>
          </div>

          {/* Main Headline */}
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Seniors: Claim Your Grocery Allowance Now</h1>
          </div>

          {/* Medicare Card Image */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-80 h-48 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg p-4 text-white">
                <div className="flex justify-between items-start mb-2">
                  <Badge className="bg-red-500 text-white text-xs px-2 py-1">VALUABLE BENEFIT</Badge>
                </div>
                <div className="space-y-1 mb-4">
                  <div className="text-lg font-semibold">Allowance Card</div>
                  <div className="text-sm opacity-90">2025 Advantage Plan</div>
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-lg font-bold">PREPAID</div>
                    <div className="text-xs opacity-75">SPEND CARD</div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">VISA</div>
                    <div className="flex gap-1 mt-1">
                      <div className="w-6 h-4 bg-white/20 rounded"></div>
                      <div className="w-6 h-4 bg-white/20 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-2 text-sm text-gray-600">
                <div className="font-semibold">The Medicare Allowance Card you'll receive</div>
                <div className="text-xs">Use at grocery stores, pharmacies & more</div>
              </div>
            </div>
          </div>

          {/* Eligibility Check */}
          <div className="text-center">
            <p className="text-red-600 font-semibold mb-4">Check Eligibility - Takes 30 Seconds!</p>
          </div>

          {/* Claim Button */}
          <Button
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 text-lg rounded-lg shadow-lg"
            size="lg"
          >
            CALL NOW →<Badge className="ml-2 bg-yellow-400 text-black text-xs">FREE</Badge>
          </Button>

          {/* Security Notice */}
          <div className="text-center text-xs text-gray-500 flex items-center justify-center gap-1">
            <div className="w-3 h-3 border border-gray-400 rounded-full flex items-center justify-center">
              <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            </div>
            Your information is secure & confidential
          </div>

          {/* Coverage Information */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-3 text-center">What Your Grocery Allowance Covers:</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">
                  <span className="font-semibold">Groceries</span> at Walmart, Target & more
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">
                  <span className="font-semibold">Prescriptions</span> at CVS, Walgreens & others
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm">
                  <span className="font-semibold">No cost</span> - Medicare covers 100%
                </span>
              </div>
            </div>
          </div>

          {/* Testimonials */}
          <div className="space-y-4">
            <h3 className="text-center font-semibold text-blue-700">What Seniors Are Saying</h3>
            <div className="space-y-3">
              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    MT
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Margaret T.</div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 italic">
                  "This grocery allowance has been a lifesaver! The process was so easy and the advisor was very
                  helpful. I'm using it for my weekly shopping."
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    RJ
                  </div>
                  <div>
                    <div className="font-semibold text-sm">Robert J.</div>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-gray-600 italic">
                  "I had no idea I qualified for this benefit! Now I can shop at Walmart and CVS without worrying about
                  my budget. It's made a huge difference for me."
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Home,
  Search,
  TrendingUp,
  CheckCircle,
  MapPin,
  Clock,
  ArrowRight,
  Menu,
  X,
  Calculator,
} from "lucide-react"
import { propertiesApi } from "@/src/lib/propertiesApi"
import type { IProperty } from "@/src/types"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter();
  const { toast } = useToast();

  const [propertyStats, setPropertyStats] = useState([
    { number: "-", label: "Properties Listed" },
    { number: "-", label: "Available Properties" },
    { number: "-", label: "Total Views" },
    { number: "-", label: "Total Inquiries" },
  ])
  const [topCities, setTopCities] = useState<Array<{ city: string, count: number }>>([])
  const [optimizationStats, setOptimizationStats] = useState([
    { number: "-", label: "Optimizations Run" },
    { number: "-", label: "Match Accuracy" },
    { number: "-", label: "Optimization Accuracy" },
    { number: "-", label: "Avg. Response Time" },
  ])
  const [randomProperty, setRandomProperty] = useState<IProperty | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [featuredProperties, setFeaturedProperties] = useState<IProperty[]>([])

  const features = [
    {
      icon: Calculator,
      title: "Linear Programming Optimization",
      description:
        "Our advanced mathematical optimization system matches tenants with properties based on budget, location, and preferences with 90%+ accuracy.",
    },
    {
      icon: Clock,
      title: "Save Time",
      description: "Find your perfect home in minutes, not months. Our optimization algorithm eliminates endless property searches.",
    },
  ]

  // Optimization stat subtitles for display
  const optimizationSubtitles = [
    'Per optimization run',
    'Linear programming precision',
    'Requirements met rate',
    'Algorithm runs completed',
  ]

  // Fetch exactly 3 properties for featured section
  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      setError(null)
      try {
        const [statsRes, randomRes] = await Promise.all([
          propertiesApi.getStats(),
          propertiesApi.getRandom(3),
        ])
        if (statsRes.success && statsRes.data) {
          setPropertyStats([
            { number: statsRes.data.totalProperties ?? "-", label: "Properties Listed" },
            { number: statsRes.data.availableProperties ?? "-", label: "Available Properties" },
            { number: statsRes.data.totalViews ?? "-", label: "Total Views" },
            { number: statsRes.data.totalInquiries ?? "-", label: "Total Inquiries" },
          ])
          setOptimizationStats([
            { number: statsRes.data.totalOptimizations ?? "-", label: "Optimizations Run" },
            { number: statsRes.data.averageMatchScore ?? "-", label: "Match Accuracy" },
            { number: statsRes.data.optimizationAccuracy ?? "-", label: "Optimization Accuracy" },
            { number: statsRes.data.avgResponseTime ?? "-", label: "Avg. Response Time" },
          ])
        }
        if (randomRes.success && Array.isArray(randomRes.data) && randomRes.data.length > 0) {
          setFeaturedProperties(randomRes.data.slice(0, 3))
          setRandomProperty(randomRes.data[0])
        }
      } catch (err: any) {
        setError("Failed to load landing page data.")
        toast({
          title: "Error loading data",
          description: "Could not fetch stats or properties. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [toast])

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Home className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">RentMatch</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-gray-600 hover:text-blue-600 transition-colors">
                How it Works
              </a>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" onClick={() => router.push("/auth-pages?mode=login")}>Sign In</Button>
              <Button onClick={() => router.push("/auth-pages?mode=signup")}>Get Started</Button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <a href="#features" className="block px-3 py-2 text-gray-600">
                Features
              </a>
              <a href="#how-it-works" className="block px-3 py-2 text-gray-600">
                How it Works
              </a>
              <div className="px-3 py-2 space-y-2">
                <Button variant="ghost" className="w-full" onClick={() => { setIsMenuOpen(false); router.push("/auth-pages?mode=login") }}>Sign In</Button>
                <Button className="w-full" onClick={() => { setIsMenuOpen(false); router.push("/auth-pages?mode=signup") }}>Get Started</Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="mb-4 bg-blue-100 text-blue-800 hover:bg-blue-100">
                🎓 Final Year Project - Linear Programming Optimization
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold text-gray-900 mb-6">
                Find Your Perfect
                <span className="text-blue-600 block">Home in Minutes</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Our linear programming optimization system connects tenants with ideal properties based on budget, location, and
                preferences. Say goodbye to endless property searches.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button size="lg" className="text-lg px-8 py-3" onClick={() => router.push("/auth-pages?mode=signup")}>
                  Start Finding Homes
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
              <div className="flex items-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Linear Programming
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Verified properties
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Instant matches
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-2xl shadow-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">Your Perfect Match</h3>
                  <Badge className="bg-green-100 text-green-800">
                    {randomProperty ? `${randomProperty.title}` : "-"}
                  </Badge>
                </div>
                {loading ? (
                  <div className="w-full h-48 flex items-center justify-center text-gray-400">Loading...</div>
                ) : error ? (
                  <div className="w-full h-48 flex items-center justify-center text-red-400">{error}</div>
                ) : randomProperty ? (
                  <>
                    <img
                      src={randomProperty.images?.[0] || "/placeholder.svg?height=200&width=400"}
                      alt={randomProperty.title}
                      className="w-full h-48 object-cover rounded-lg mb-4"
                    />
                    <div className="space-y-2">
                      <h4 className="font-semibold">{randomProperty.title}</h4>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{randomProperty.location?.address}, {randomProperty.location?.city}, {randomProperty.location?.state}</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">₦{randomProperty.rent?.toLocaleString()}/year</p>
                    </div>
                  </>
                ) : (
                  <div className="w-full h-48 flex items-center justify-center text-gray-400">No property found.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Demonstration Stats Block */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Project Demonstration Stats</h2>
            <p className="text-gray-600">Current performance metrics of the optimization model</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-center">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-24 w-full rounded-lg" />
              ))
            ) : error ? (
              <div className="col-span-4 flex flex-col items-center justify-center">
                <span className="text-red-500 mb-2">{error}</span>
                <Button onClick={() => window.location.reload()}>Retry</Button>
              </div>
            ) : (
              <>
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-extrabold text-blue-600 mb-1">{propertyStats[0]?.number}</div>
                    <div className="text-gray-600">Properties Listed</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-extrabold text-blue-600 mb-1">{propertyStats[1]?.number}</div>
                    <div className="text-gray-600">Available Properties</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-extrabold text-blue-600 mb-1">{optimizationStats[3]?.number}</div>
                    <div className="text-gray-600">Optimization Time</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-extrabold text-blue-600 mb-1">{optimizationStats[1]?.number}</div>
                    <div className="text-gray-600">Match Accuracy</div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Linear Programming Performance Block */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 mt-0">
            <h2 className="text-3xl font-bold mb-2">Linear Programming Performance</h2>
            <p className="text-gray-600">Real-time optimization algorithm metrics</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8 justify-center mb-16">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-extrabold text-blue-600 mb-1">{optimizationStats[0]?.number}</div>
                <div className="text-gray-600 text-base font-medium mb-1">Avg. Execution Time</div>
                <div className="text-xs text-gray-400 text-center">Per optimization run</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-extrabold text-purple-600 mb-1">{optimizationStats[2]?.number}</div>
                <div className="text-gray-600 text-base font-medium mb-1">Constraint Satisfaction</div>
                <div className="text-xs text-gray-400 text-center">Requirements met rate</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-extrabold text-red-600 mb-1">{optimizationStats[0]?.number}</div>
                <div className="text-gray-600 text-base font-medium mb-1">Total Optimizations</div>
                <div className="text-xs text-gray-400 text-center">Algorithm runs completed</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Property Stats Block */}
      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">Property Stats</h2>
            <p className="text-gray-600">Platform activity metrics</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-8 justify-center">
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-extrabold text-blue-600 mb-1">{propertyStats[2]?.number}</div>
                <div className="text-gray-600">Total Views</div>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-lg">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-extrabold text-blue-600 mb-1">{propertyStats[3]?.number}</div>
                <div className="text-gray-600">Total Inquiries</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Properties Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-2">Featured Properties</h2>
            <p className="text-gray-600 mb-8">Discover amazing properties from our database</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-64 w-full rounded-lg" />
              ))
            ) : error ? (
              <div className="col-span-3 flex flex-col items-center justify-center">
                <span className="text-red-500 mb-2">{error}</span>
                <Button onClick={() => window.location.reload()}>Retry</Button>
              </div>
            ) : featuredProperties.map((property, idx) => (
              <Card key={property._id || idx} className="shadow-lg border-0">
                <CardContent className="p-0">
                  <img src={property.images?.[0] || "/placeholder.svg?height=200&width=400"} alt={property.title} className="w-full h-48 object-cover rounded-t-lg" />
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-lg truncate">{property.title}</span>
                      <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded-full">{property.bedrooms}BR • {property.bathrooms}BA</span>
                    </div>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm truncate">{property.location?.city}, {property.location?.state}</span>
                    </div>
                    <div className="text-xl font-bold text-blue-600 mb-2">₦{property.rent?.toLocaleString()}/year</div>
                    <div className="flex flex-wrap gap-2">
                      {property.amenities?.slice(0, 3).map((am, i) => (
                        <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full">{am}</span>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">Why Choose RentMatch?</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our advanced optimization model ensures perfect tenant-property matches, saving time and reducing vacancy
              periods for everyone.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">How RentMatch Works</h2>
            <p className="text-xl text-gray-600">Simple, fast, and effective</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Set Your Preferences</h3>
              <p className="text-gray-600">Tell us your budget, preferred location, and must-have amenities</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Get Smart Matches</h3>
              <p className="text-gray-600">Our optimization algorithm finds properties that perfectly match your criteria</p>
            </div>
            <div className="text-center">
              <div className="bg-blue-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Move In</h3>
              <p className="text-gray-600">Connect with verified landlords and secure your perfect home</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Ready to Find Your Perfect Home?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Experience how linear programming optimization can revolutionize property matching in Nigeria's rental market.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-3" onClick={() => router.push("/auth-pages?mode=signup")}>
              Start as Tenant
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="text-lg px-8 py-3 bg-white text-blue-600 hover:bg-gray-100"
            >
              List Your Property
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Home className="h-8 w-8 text-blue-400" />
              <span className="text-2xl font-bold">RentMatch</span>
            </div>
            <p className="text-gray-400 mb-4">Final Year Project - Optimization Model for Tenant-Property Matching</p>
            <p className="text-gray-500 text-sm">Built with Linear Programming • University Project • 2025</p>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  )
}

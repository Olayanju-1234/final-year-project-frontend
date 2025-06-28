"use client"

import { useState } from "react"
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

export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter();

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

  const stats = [
    { number: "50+", label: "Properties Listed" },
    { number: "25+", label: "Successful Matches" },
    { number: "95%", label: "Match Accuracy" },
    { number: "<30s", label: "Optimization Time" },
  ]

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
                  <Badge className="bg-green-100 text-green-800">94% Match</Badge>
                </div>
                <img
                  src="/placeholder.svg?height=200&width=400"
                  alt="Property"
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
                <div className="space-y-2">
                  <h4 className="font-semibold">Modern 2BR Apartment</h4>
                  <div className="flex items-center text-gray-600">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">Victoria Island, Lagos</span>
                  </div>
                  <p className="text-2xl font-bold text-blue-600">₦850,000/year</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Demonstration Stats</h2>
            <p className="text-gray-600">Current performance metrics of the optimization model</p>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
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
    </div>
  )
}

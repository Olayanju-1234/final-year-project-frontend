"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MapPin, Bed, Bath, Eye, Heart } from "lucide-react"
import type { Property, PropertyMatch } from "@/lib/api"

interface PropertyCardProps {
  property: Property
  match?: PropertyMatch
  onView: (id: string) => void
  onContact?: (id: string) => void
  showMatchScore?: boolean
}

export function PropertyCard({ property, match, onView, onContact, showMatchScore = false }: PropertyCardProps) {
  const matchScore = match?.matchScore || 0

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="md:flex">
        <div className="md:w-1/3">
          <img
            src={property.images[0] || "/placeholder.svg?height=200&width=300"}
            alt={property.title}
            className="w-full h-48 md:h-full object-cover"
          />
        </div>
        <div className="md:w-2/3 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-2">{property.title}</h4>
              <div className="flex items-center text-gray-600 mb-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{property.location}</span>
              </div>
              <p className="text-2xl font-bold text-blue-600">₦{property.rent.toLocaleString()}/year</p>
            </div>
            {showMatchScore && match && (
              <div className="text-right">
                <Badge
                  variant={matchScore >= 90 ? "default" : matchScore >= 80 ? "secondary" : "outline"}
                  className="text-sm mb-2"
                >
                  {matchScore}% Match
                </Badge>
                <Progress value={matchScore} className="w-24" />
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4 mb-4 text-sm text-gray-600">
            <div className="flex items-center">
              <Bed className="h-4 w-4 mr-1" />
              <span>{property.bedrooms} bed</span>
            </div>
            <div className="flex items-center">
              <Bath className="h-4 w-4 mr-1" />
              <span>{property.bathrooms} bath</span>
            </div>
            {property.size && <span>{property.size} sqm</span>}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {property.amenities.slice(0, 4).map((amenity) => (
              <Badge key={amenity} variant="outline" className="text-xs">
                {amenity}
              </Badge>
            ))}
            {property.amenities.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{property.amenities.length - 4} more
              </Badge>
            )}
          </div>

          <p className="text-gray-600 mb-4 line-clamp-2">{property.description}</p>

          {showMatchScore && match && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <h5 className="font-medium text-green-800 mb-2">Why this matches you:</h5>
              <ul className="text-sm text-green-700 space-y-1">
                {match.explanation.slice(0, 2).map((reason, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-500 mr-2">•</span>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">Listed by {property.landlordName}</p>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={() => onView(property.id)}>
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
              {onContact && (
                <Button size="sm" onClick={() => onContact(property.id)}>
                  <Heart className="h-4 w-4 mr-2" />
                  Contact
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}

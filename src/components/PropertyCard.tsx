
import { Link } from "react-router-dom";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath, Square, MapPin, DollarSign } from "lucide-react";

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    type: string;
    propertyType: string;
    price: number;
    bedrooms?: number;
    bathrooms?: number;
    area: number;
    address: {
      city: string;
      state: string;
    };
    images: string[];
    status: string;
  };
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="overflow-hidden card-hover">
      <div className="relative h-48 overflow-hidden">
        <img
          src={property.images[0] || "/placeholder.svg"}
          alt={property.title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
        <div className="absolute top-2 left-2">
          <Badge variant={property.type === "residential" ? "default" : "secondary"}>
            {property.type === "residential" ? "Residential" : "Commercial"}
          </Badge>
        </div>
        <div className="absolute top-2 right-2">
          <Badge variant={property.status === "active" ? "outline" : "destructive"}>
            {property.status === "active" ? "Active" : "Sold"}
          </Badge>
        </div>
      </div>

      <CardContent className="pt-4">
        <h3 className="text-lg font-semibold line-clamp-1">{property.title}</h3>
        
        <div className="flex items-center mt-1 text-muted-foreground">
          <MapPin className="h-4 w-4 mr-1" />
          <span className="text-sm">
            {property.address.city}, {property.address.state}
          </span>
        </div>
        
        <div className="mt-4 flex justify-between">
          <div className="flex items-center space-x-3">
            {property.type === "residential" && (
              <>
                <div className="flex items-center">
                  <Bed className="h-4 w-4 mr-1" />
                  <span className="text-sm">{property.bedrooms}</span>
                </div>
                <div className="flex items-center">
                  <Bath className="h-4 w-4 mr-1" />
                  <span className="text-sm">{property.bathrooms}</span>
                </div>
              </>
            )}
            <div className="flex items-center">
              <Square className="h-4 w-4 mr-1" />
              <span className="text-sm">{property.area} sq ft</span>
            </div>
          </div>
        </div>
      </CardContent>

      <CardFooter className="border-t flex justify-between pt-4 pb-4">
        <div className="flex items-center text-primary font-semibold">
          <DollarSign className="h-5 w-5 mr-1" />
          {formatPrice(property.price)}
        </div>
        <Link 
          to={`/property/${property.id}`} 
          className="text-primary font-medium hover:underline"
        >
          View Details
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PropertyCard;

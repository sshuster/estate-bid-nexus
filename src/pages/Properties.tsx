
import { useState, useEffect } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { mockProperties } from "@/lib/mockData";
import PropertyCard from "@/components/PropertyCard";
import { Search, Filter, MapPin } from "lucide-react";

const Properties = () => {
  const [properties, setProperties] = useState(mockProperties);
  const [searchTerm, setSearchTerm] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [location, setLocation] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [filteredProperties, setFilteredProperties] = useState(mockProperties);

  // Get unique locations from properties
  const locations = [...new Set(mockProperties.map(p => p.address.state))];

  // Format price for display
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Filter properties based on search and filters
  useEffect(() => {
    let filtered = [...mockProperties];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        property =>
          property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.address.state.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by property type
    if (propertyType !== "all") {
      filtered = filtered.filter(property => property.type === propertyType);
    }

    // Filter by price range
    filtered = filtered.filter(
      property => property.price >= priceRange[0] && property.price <= priceRange[1]
    );

    // Filter by location
    if (location !== "all") {
      filtered = filtered.filter(property => property.address.state === location);
    }

    setFilteredProperties(filtered);
  }, [searchTerm, propertyType, priceRange, location]);

  return (
    <MainLayout>
      <div className="bg-primary text-white py-12">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Find Your Perfect Property</h1>
          <div className="relative max-w-3xl mx-auto">
            <Input
              type="text"
              placeholder="Search by location, property type, or keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-4 py-6 w-full text-gray-900 rounded-lg"
            />
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <Button 
              className="absolute right-1 top-1/2 transform -translate-y-1/2"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="mr-2 h-4 w-4" /> Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="container-custom py-8">
        {/* Filters Section */}
        {showFilters && (
          <div className="bg-gray-50 p-6 rounded-lg mb-8">
            <h2 className="text-xl font-bold mb-4">Filters</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium mb-2">Property Type</label>
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Properties</SelectItem>
                    <SelectItem value="residential">Residential</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Location</label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.map(loc => (
                      <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Price Range: {formatPrice(priceRange[0])} - {formatPrice(priceRange[1])}
                </label>
                <Slider
                  defaultValue={[0, 5000000]}
                  max={5000000}
                  step={50000}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="mt-6"
                />
              </div>
            </div>
          </div>
        )}

        {/* Properties Count */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold">{filteredProperties.length} Properties</h2>
            {location !== "all" && (
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <MapPin className="h-4 w-4 mr-1" /> 
                <span>Filtered by location: {location}</span>
              </div>
            )}
          </div>
          <Select defaultValue="newest">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredProperties.map(property => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">No properties found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or filters to find properties.
            </p>
            <Button onClick={() => {
              setSearchTerm("");
              setPropertyType("all");
              setPriceRange([0, 5000000]);
              setLocation("all");
            }}>
              Reset Filters
            </Button>
          </div>
        )}

        {/* Pagination */}
        {filteredProperties.length > 0 && (
          <div className="flex justify-center mt-8">
            <nav className="flex items-center space-x-2">
              <Button variant="outline" disabled>
                Previous
              </Button>
              <Button variant="outline" className="bg-primary text-white">
                1
              </Button>
              <Button variant="outline">2</Button>
              <Button variant="outline">3</Button>
              <span className="mx-2">...</span>
              <Button variant="outline">Next</Button>
            </nav>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Properties;

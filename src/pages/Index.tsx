
import { useState } from "react";
import { Link } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PropertyCard from "@/components/PropertyCard";
import { mockProperties } from "@/lib/mockData";
import { Building2, Home, Search, TrendingUp, Users, Shield } from "lucide-react";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Get featured properties (just 3 for the homepage)
  const featuredProperties = mockProperties.slice(0, 3);

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-primary text-white py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">
                Find Your Perfect Property
              </h1>
              <p className="text-lg md:text-xl opacity-90">
                Connect with property owners, buyers, and real estate agents on our innovative
                bidding platform.
              </p>

              {/* Search */}
              <div className="relative max-w-xl">
                <Input
                  type="text"
                  placeholder="Search by location, property type, or keyword..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-4 py-6 w-full text-gray-900 rounded-lg"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <Button className="absolute right-1 top-1/2 transform -translate-y-1/2">
                  Search
                </Button>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link to="/properties?type=residential">
                  <Badge>Residential</Badge>
                </Link>
                <Link to="/properties?type=commercial">
                  <Badge>Commercial</Badge>
                </Link>
                <Link to="/properties?propertyType=house">
                  <Badge>Houses</Badge>
                </Link>
                <Link to="/properties?propertyType=condo">
                  <Badge>Condos</Badge>
                </Link>
                <Link to="/properties?propertyType=retail">
                  <Badge>Retail</Badge>
                </Link>
                <Link to="/properties?propertyType=office">
                  <Badge>Office</Badge>
                </Link>
              </div>
            </div>

            <div className="hidden lg:block">
              <img
                src="/assets/hero-image.jpg"
                alt="Modern real estate"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-14 bg-gray-50">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-primary mb-2">500+</div>
              <div className="text-gray-600">Active Listings</div>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-primary mb-2">1200+</div>
              <div className="text-gray-600">Happy Clients</div>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-primary mb-2">150+</div>
              <div className="text-gray-600">Expert Agents</div>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-primary mb-2">$120M+</div>
              <div className="text-gray-600">Property Sold</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Properties */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Properties</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Explore our handpicked selection of premier properties available for purchase or lease.
            </p>
          </div>

          <Tabs defaultValue="all" className="mb-8">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="residential">Residential</TabsTrigger>
              <TabsTrigger value="commercial">Commercial</TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="residential" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProperties
                  .filter((p) => p.type === "residential")
                  .map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
              </div>
            </TabsContent>
            <TabsContent value="commercial" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredProperties
                  .filter((p) => p.type === "commercial")
                  .map((property) => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
              </div>
            </TabsContent>
          </Tabs>

          <div className="text-center mt-10">
            <Button asChild size="lg">
              <Link to="/properties">View All Properties</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How It Works</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Our platform connects property owners, potential buyers, and real estate professionals
              through an innovative bidding system.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">List Your Property</h3>
              <p className="text-gray-600">
                Create a detailed listing with photos, specifications, and your desired price.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Receive Bids</h3>
              <p className="text-gray-600">
                Interested buyers place bids on your property or agents bid to represent you.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-3">Close the Deal</h3>
              <p className="text-gray-600">
                Accept the best offer and use our platform tools to complete the transaction.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Button asChild variant="outline" size="lg">
              <Link to="/register">Get Started Today</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Why Choose EstateBidNexus</h2>
              <p className="text-gray-600 mb-8">
                We've revolutionized the real estate market by creating a transparent bidding
                platform that benefits all parties involved in property transactions.
              </p>

              <div className="space-y-6">
                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                      <Shield className="h-6 w-6 text-secondary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">Secure Transactions</h3>
                    <p className="text-gray-600">
                      Our platform ensures that all transactions are secure, verified, and
                      protected.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                      <Users className="h-6 w-6 text-secondary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">Verified Professionals</h3>
                    <p className="text-gray-600">
                      Connect with verified real estate agents and brokers with proven track
                      records.
                    </p>
                  </div>
                </div>

                <div className="flex">
                  <div className="flex-shrink-0 mr-4">
                    <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-secondary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-2">Market Insights</h3>
                    <p className="text-gray-600">
                      Access to real-time market data to help you make informed decisions.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg overflow-hidden shadow-xl">
              <img
                src="/assets/why-choose-us.jpg"
                alt="Real estate professionals"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-white py-16">
        <div className="container-custom text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-8">
            Join thousands of property owners, buyers, and agents who use our platform to simplify
            real estate transactions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link to="/register">Create an Account</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="bg-transparent text-white">
              <Link to="/properties">Browse Properties</Link>
            </Button>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

// Custom Badge component for the hero section
const Badge = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="inline-block bg-white/20 hover:bg-white/30 text-white px-3 py-1 rounded-full text-sm transition-colors">
      {children}
    </div>
  );
};

export default Index;

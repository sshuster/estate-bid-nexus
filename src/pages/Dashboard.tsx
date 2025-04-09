
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import MainLayout from "@/layouts/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { mockProperties, mockBids, mockAgentContracts } from "@/lib/mockData";
import { AgGridReact } from "ag-grid-react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-alpine.css";
import { Building2, Users, DollarSign, TrendingUp, Home, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropertyCard from "@/components/PropertyCard";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const [userProperties, setUserProperties] = useState([]);
  const [userBids, setUserBids] = useState([]);
  const [userContracts, setUserContracts] = useState([]);
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Filter data for current user
  useEffect(() => {
    if (user) {
      const properties = mockProperties.filter(prop => prop.ownerId === user.id);
      setUserProperties(properties);
      
      const bids = mockBids.filter(bid => bid.userId === user.id);
      setUserBids(bids);
      
      const contracts = mockAgentContracts.filter(
        contract => contract.ownerId === user.id || contract.agentId === user.id
      );
      setUserContracts(contracts);
    }
  }, [user]);

  // Format price for display
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Calculate stats
  const totalPropertyValue = userProperties.reduce((total, prop) => total + prop.price, 0);
  const totalBids = userBids.length;
  const activeBids = userBids.filter(bid => bid.status === "pending").length;
  const successfulBids = userBids.filter(bid => bid.status === "accepted").length;
  
  // Data for the chart
  const chartData = [
    { name: 'Jan', value: 4000 },
    { name: 'Feb', value: 3000 },
    { name: 'Mar', value: 5000 },
    { name: 'Apr', value: 2780 },
    { name: 'May', value: 1890 },
    { name: 'Jun', value: 2390 },
    { name: 'Jul', value: 3490 },
  ];
  
  // AG-Grid column definitions for properties
  const propertyColumns = [
    { headerName: "Title", field: "title", sortable: true, filter: true, flex: 1 },
    { headerName: "Type", field: "type", sortable: true, filter: true },
    { headerName: "Price", field: "price", sortable: true, filter: true, 
      valueFormatter: params => formatPrice(params.value) },
    { headerName: "Status", field: "status", sortable: true, filter: true },
  ];
  
  // AG-Grid column definitions for bids
  const bidColumns = [
    { headerName: "Property", field: "propertyId", sortable: true, filter: true,
      valueGetter: params => {
        const property = mockProperties.find(p => p.id === params.data.propertyId);
        return property ? property.title : 'Unknown Property';
      }
    },
    { headerName: "Amount", field: "amount", sortable: true, filter: true,
      valueFormatter: params => formatPrice(params.value) },
    { headerName: "Status", field: "status", sortable: true, filter: true },
    { headerName: "Date", field: "timestamp", sortable: true, filter: true,
      valueFormatter: params => new Date(params.value).toLocaleDateString() }
  ];
  
  // AG-Grid column definitions for contracts
  const contractColumns = [
    { headerName: "Property", field: "propertyId", sortable: true, filter: true,
      valueGetter: params => {
        const property = mockProperties.find(p => p.id === params.data.propertyId);
        return property ? property.title : 'Unknown Property';
      }
    },
    { headerName: "Commission", field: "commission", sortable: true, filter: true,
      valueFormatter: params => `${params.value}%` },
    { headerName: "Status", field: "status", sortable: true, filter: true },
    { headerName: "Start Date", field: "startDate", sortable: true, filter: true,
      valueFormatter: params => new Date(params.value).toLocaleDateString() },
    { headerName: "End Date", field: "endDate", sortable: true, filter: true,
      valueFormatter: params => new Date(params.value).toLocaleDateString() }
  ];

  return (
    <MainLayout>
      <div className="container-custom py-8">
        <h1 className="text-3xl font-bold mb-6">Welcome, {user?.username}</h1>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="p-2 bg-primary/10 rounded-full mr-4">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">My Properties</p>
                <h3 className="text-2xl font-bold">{userProperties.length}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="p-2 bg-primary/10 rounded-full mr-4">
                <TrendingUp className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Bids</p>
                <h3 className="text-2xl font-bold">{totalBids}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="p-2 bg-primary/10 rounded-full mr-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Contracts</p>
                <h3 className="text-2xl font-bold">{userContracts.length}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="p-2 bg-primary/10 rounded-full mr-4">
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Property Value</p>
                <h3 className="text-2xl font-bold">{formatPrice(totalPropertyValue)}</h3>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Main Content Tabs */}
        <Tabs defaultValue="properties">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="properties">My Properties</TabsTrigger>
            <TabsTrigger value="bids">My Bids</TabsTrigger>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>
          
          {/* Properties Tab */}
          <TabsContent value="properties">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">My Properties</h2>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add New Property
              </Button>
            </div>
            
            {userProperties.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {userProperties.map(property => (
                    <PropertyCard key={property.id} property={property} />
                  ))}
                </div>
                
                <h3 className="text-xl font-semibold mb-4">Property Details</h3>
                <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
                  <AgGridReact
                    rowData={userProperties}
                    columnDefs={propertyColumns}
                    pagination={true}
                    paginationPageSize={10}
                  />
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Home className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Properties Found</h3>
                  <p className="text-muted-foreground mb-6">You haven't listed any properties yet.</p>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Add Your First Property
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Bids Tab */}
          <TabsContent value="bids">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">My Bids</h2>
            </div>
            
            {userBids.length > 0 ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Total Bids</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{totalBids}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Active Bids</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{activeBids}</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle>Successful Bids</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold">{successfulBids}</div>
                    </CardContent>
                  </Card>
                </div>
                
                <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
                  <AgGridReact
                    rowData={userBids}
                    columnDefs={bidColumns}
                    pagination={true}
                    paginationPageSize={10}
                  />
                </div>
              </>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <TrendingUp className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Bids Found</h3>
                  <p className="text-muted-foreground mb-6">You haven't placed any bids yet.</p>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Browse Properties
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Contracts Tab */}
          <TabsContent value="contracts">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">My Contracts</h2>
            </div>
            
            {userContracts.length > 0 ? (
              <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
                <AgGridReact
                  rowData={userContracts}
                  columnDefs={contractColumns}
                  pagination={true}
                  paginationPageSize={10}
                />
              </div>
            ) : (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <Users className="h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No Contracts Found</h3>
                  <p className="text-muted-foreground mb-6">You don't have any active contracts.</p>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" /> Find an Agent
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-6">Market Insights</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Property Value Trends</CardTitle>
                    <CardDescription>Monthly average property values in your area</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => [`$${value}`, 'Value']} />
                          <Legend />
                          <Bar dataKey="value" fill="#2C7FB8" name="Property Value" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Bid Activity</CardTitle>
                    <CardDescription>Monthly bid activity on the platform</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-80">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="value" fill="#27AE60" name="Bids" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Dashboard;

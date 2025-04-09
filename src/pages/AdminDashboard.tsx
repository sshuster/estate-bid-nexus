
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import MainLayout from "@/layouts/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { mockUsers, mockProperties, mockBids, mockAgentContracts } from "@/lib/mockData";
import { AgGridReact } from "ag-grid-react";
import "@ag-grid-community/styles/ag-grid.css";
import "@ag-grid-community/styles/ag-theme-alpine.css";
import { 
  Users, 
  Building2, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Search,
  UserX
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

const AdminDashboard = () => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState(mockUsers);
  const [properties, setProperties] = useState(mockProperties);
  const [bids, setBids] = useState(mockBids);
  const [contracts, setContracts] = useState(mockAgentContracts);
  const [searchTerm, setSearchTerm] = useState("");
  const [userToDelete, setUserToDelete] = useState(null);
  const [propertyToRemove, setPropertyToRemove] = useState(null);

  // Redirect if not authenticated or not an admin
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" />;
  }

  // Format price for display
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Filter data based on search term
  const filteredUsers = users.filter(
    user => 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProperties = properties.filter(
    property => 
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.address.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle user deletion
  const handleDeleteUser = (userId) => {
    // Find the user to delete
    const userToRemove = users.find(u => u.id === userId);
    if (userToRemove) {
      setUserToDelete(userToRemove);
    }
  };

  const confirmDeleteUser = () => {
    if (userToDelete) {
      // Remove the user
      const updatedUsers = users.filter(u => u.id !== userToDelete.id);
      setUsers(updatedUsers);
      
      // Show success toast
      toast({
        title: "User Removed",
        description: `User ${userToDelete.username} has been removed successfully.`,
        variant: "default",
      });
      
      // Clear the user to delete
      setUserToDelete(null);
    }
  };

  // Handle property removal
  const handleRemoveProperty = (propertyId) => {
    // Find the property to remove
    const propertyToDelete = properties.find(p => p.id === propertyId);
    if (propertyToDelete) {
      setPropertyToRemove(propertyToDelete);
    }
  };

  const confirmRemoveProperty = () => {
    if (propertyToRemove) {
      // Remove the property
      const updatedProperties = properties.filter(p => p.id !== propertyToRemove.id);
      setProperties(updatedProperties);
      
      // Show success toast
      toast({
        title: "Property Removed",
        description: `Property "${propertyToRemove.title}" has been removed successfully.`,
        variant: "default",
      });
      
      // Clear the property to remove
      setPropertyToRemove(null);
    }
  };

  // AG-Grid column definitions for users
  const userColumns = [
    { headerName: "Username", field: "username", sortable: true, filter: true, flex: 1 },
    { headerName: "Email", field: "email", sortable: true, filter: true, flex: 1 },
    { headerName: "Role", field: "role", sortable: true, filter: true },
    { 
      headerName: "Actions", 
      cellRenderer: params => {
        return (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDeleteUser(params.data.id)}
          >
            <UserX className="h-4 w-4 mr-1" /> Remove
          </Button>
        );
      },
      width: 120
    }
  ];

  // AG-Grid column definitions for properties
  const propertyColumns = [
    { headerName: "Title", field: "title", sortable: true, filter: true, flex: 1 },
    { headerName: "Type", field: "type", sortable: true, filter: true },
    { 
      headerName: "Owner", 
      field: "ownerId", 
      sortable: true, 
      filter: true,
      valueGetter: params => {
        const owner = users.find(u => u.id === params.data.ownerId);
        return owner ? owner.username : 'Unknown User';
      }
    },
    { headerName: "Price", field: "price", sortable: true, filter: true, 
      valueFormatter: params => formatPrice(params.value) },
    { headerName: "Status", field: "status", sortable: true, filter: true },
    { 
      headerName: "Actions", 
      cellRenderer: params => {
        return (
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleRemoveProperty(params.data.id)}
          >
            <XCircle className="h-4 w-4 mr-1" /> Remove
          </Button>
        );
      },
      width: 120
    }
  ];

  // AG-Grid column definitions for bids
  const bidColumns = [
    { 
      headerName: "Property", 
      field: "propertyId", 
      sortable: true, 
      filter: true,
      flex: 1,
      valueGetter: params => {
        const property = properties.find(p => p.id === params.data.propertyId);
        return property ? property.title : 'Unknown Property';
      }
    },
    { 
      headerName: "User", 
      field: "userId", 
      sortable: true, 
      filter: true,
      valueGetter: params => {
        const user = users.find(u => u.id === params.data.userId);
        return user ? user.username : 'Unknown User';
      }
    },
    { headerName: "Amount", field: "amount", sortable: true, filter: true,
      valueFormatter: params => formatPrice(params.value) },
    { headerName: "Status", field: "status", sortable: true, filter: true },
    { headerName: "Date", field: "timestamp", sortable: true, filter: true,
      valueFormatter: params => new Date(params.value).toLocaleDateString() },
    { 
      headerName: "Actions", 
      cellRenderer: params => {
        if (params.data.status === "pending") {
          return (
            <div className="flex space-x-2">
              <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-4 w-4 mr-1" /> Approve
              </Button>
              <Button variant="destructive" size="sm">
                <XCircle className="h-4 w-4 mr-1" /> Reject
              </Button>
            </div>
          );
        }
        return null;
      },
      width: 180
    }
  ];

  // AG-Grid column definitions for contracts
  const contractColumns = [
    { 
      headerName: "Property", 
      field: "propertyId", 
      sortable: true, 
      filter: true,
      flex: 1,
      valueGetter: params => {
        const property = properties.find(p => p.id === params.data.propertyId);
        return property ? property.title : 'Unknown Property';
      }
    },
    { 
      headerName: "Owner", 
      field: "ownerId", 
      sortable: true, 
      filter: true,
      valueGetter: params => {
        const owner = users.find(u => u.id === params.data.ownerId);
        return owner ? owner.username : 'Unknown User';
      }
    },
    { 
      headerName: "Agent", 
      field: "agentId", 
      sortable: true, 
      filter: true,
      valueGetter: params => {
        const agent = users.find(u => u.id === params.data.agentId);
        return agent ? agent.username : 'Unknown User';
      }
    },
    { headerName: "Commission", field: "commission", sortable: true, filter: true,
      valueFormatter: params => `${params.value}%` },
    { headerName: "Status", field: "status", sortable: true, filter: true },
    { headerName: "Start Date", field: "startDate", sortable: true, filter: true,
      valueFormatter: params => new Date(params.value).toLocaleDateString() },
    { headerName: "End Date", field: "endDate", sortable: true, filter: true,
      valueFormatter: params => new Date(params.value).toLocaleDateString() },
    { 
      headerName: "Actions", 
      cellRenderer: params => {
        if (params.data.status === "pending") {
          return (
            <div className="flex space-x-2">
              <Button variant="default" size="sm" className="bg-green-600 hover:bg-green-700">
                <CheckCircle className="h-4 w-4 mr-1" /> Approve
              </Button>
              <Button variant="destructive" size="sm">
                <XCircle className="h-4 w-4 mr-1" /> Reject
              </Button>
            </div>
          );
        }
        return (
          <Button variant="destructive" size="sm">
            <XCircle className="h-4 w-4 mr-1" /> Terminate
          </Button>
        );
      },
      width: 180
    }
  ];

  return (
    <MainLayout>
      <div className="container-custom py-8">
        <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="p-2 bg-primary/10 rounded-full mr-4">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Users</p>
                <h3 className="text-2xl font-bold">{users.length}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="p-2 bg-primary/10 rounded-full mr-4">
                <Building2 className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Properties</p>
                <h3 className="text-2xl font-bold">{properties.length}</h3>
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
                <h3 className="text-2xl font-bold">{bids.length}</h3>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="flex items-center p-6">
              <div className="p-2 bg-primary/10 rounded-full mr-4">
                <AlertTriangle className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending Approvals</p>
                <h3 className="text-2xl font-bold">
                  {bids.filter(b => b.status === "pending").length + 
                   contracts.filter(c => c.status === "pending").length}
                </h3>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Search Bar */}
        <div className="relative mb-8">
          <Input
            type="text"
            placeholder="Search users, properties, or addresses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
        </div>
        
        {/* Main Content Tabs */}
        <Tabs defaultValue="users">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="bids">Bids</TabsTrigger>
            <TabsTrigger value="contracts">Contracts</TabsTrigger>
          </TabsList>
          
          {/* Users Tab */}
          <TabsContent value="users">
            <div className="ag-theme-alpine" style={{ height: 600, width: '100%' }}>
              <AgGridReact
                rowData={filteredUsers}
                columnDefs={userColumns}
                pagination={true}
                paginationPageSize={10}
              />
            </div>
          </TabsContent>
          
          {/* Properties Tab */}
          <TabsContent value="properties">
            <div className="ag-theme-alpine" style={{ height: 600, width: '100%' }}>
              <AgGridReact
                rowData={filteredProperties}
                columnDefs={propertyColumns}
                pagination={true}
                paginationPageSize={10}
              />
            </div>
          </TabsContent>
          
          {/* Bids Tab */}
          <TabsContent value="bids">
            <div className="ag-theme-alpine" style={{ height: 600, width: '100%' }}>
              <AgGridReact
                rowData={bids}
                columnDefs={bidColumns}
                pagination={true}
                paginationPageSize={10}
              />
            </div>
          </TabsContent>
          
          {/* Contracts Tab */}
          <TabsContent value="contracts">
            <div className="ag-theme-alpine" style={{ height: 600, width: '100%' }}>
              <AgGridReact
                rowData={contracts}
                columnDefs={contractColumns}
                pagination={true}
                paginationPageSize={10}
              />
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Delete User Dialog */}
        <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to remove this user?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the user 
                {userToDelete && ` ${userToDelete.username}`} and remove their data from the system.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDeleteUser} className="bg-destructive">
                Remove User
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        
        {/* Remove Property Dialog */}
        <AlertDialog open={!!propertyToRemove} onOpenChange={() => setPropertyToRemove(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure you want to remove this property?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the property
                {propertyToRemove && ` "${propertyToRemove.title}"`} and all associated data.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmRemoveProperty} className="bg-destructive">
                Remove Property
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </MainLayout>
  );
};

export default AdminDashboard;


// This service handles API communication with the Flask backend

// Base URL for API calls
const API_URL = "http://localhost:5000/api";

// Helper function for handling API responses
const handleResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "An error occurred");
  }
  return response.json();
};

// Auth API calls
export const authApi = {
  login: async (username: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    return handleResponse(response);
  },

  register: async (username: string, email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
    });
    return handleResponse(response);
  },

  logout: async () => {
    const response = await fetch(`${API_URL}/auth/logout`, {
      method: "POST",
    });
    return handleResponse(response);
  },
};

// Property API calls
export const propertyApi = {
  getAllProperties: async () => {
    const response = await fetch(`${API_URL}/properties`);
    return handleResponse(response);
  },

  getPropertyById: async (id: string) => {
    const response = await fetch(`${API_URL}/properties/${id}`);
    return handleResponse(response);
  },

  createProperty: async (propertyData: any, token: string) => {
    const response = await fetch(`${API_URL}/properties`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(propertyData),
    });
    return handleResponse(response);
  },

  updateProperty: async (id: string, propertyData: any, token: string) => {
    const response = await fetch(`${API_URL}/properties/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(propertyData),
    });
    return handleResponse(response);
  },

  deleteProperty: async (id: string, token: string) => {
    const response = await fetch(`${API_URL}/properties/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
};

// Bid API calls
export const bidApi = {
  createBid: async (bidData: any, token: string) => {
    const response = await fetch(`${API_URL}/bids`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(bidData),
    });
    return handleResponse(response);
  },

  getBidsByProperty: async (propertyId: string) => {
    const response = await fetch(`${API_URL}/bids/property/${propertyId}`);
    return handleResponse(response);
  },

  getBidsByUser: async (token: string) => {
    const response = await fetch(`${API_URL}/bids/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  updateBidStatus: async (id: string, status: string, token: string) => {
    const response = await fetch(`${API_URL}/bids/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  },
};

// Contract API calls
export const contractApi = {
  createContract: async (contractData: any, token: string) => {
    const response = await fetch(`${API_URL}/contracts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(contractData),
    });
    return handleResponse(response);
  },

  getContractsByUser: async (token: string) => {
    const response = await fetch(`${API_URL}/contracts/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  updateContractStatus: async (id: string, status: string, token: string) => {
    const response = await fetch(`${API_URL}/contracts/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });
    return handleResponse(response);
  },
};

// Admin API calls
export const adminApi = {
  getAllUsers: async (token: string) => {
    const response = await fetch(`${API_URL}/admin/users`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  deleteUser: async (id: string, token: string) => {
    const response = await fetch(`${API_URL}/admin/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  getAllBids: async (token: string) => {
    const response = await fetch(`${API_URL}/admin/bids`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },

  getAllContracts: async (token: string) => {
    const response = await fetch(`${API_URL}/admin/contracts`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return handleResponse(response);
  },
};

export default {
  auth: authApi,
  property: propertyApi,
  bid: bidApi,
  contract: contractApi,
  admin: adminApi,
};

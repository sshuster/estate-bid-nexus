
import { v4 as uuidv4 } from 'uuid';

// Mock users for testing
export const mockUsers = [
  {
    id: 'user-1',
    username: 'muser',
    email: 'muser@example.com',
    password: 'muser', // In a real app, NEVER store plain text passwords
    role: 'user',
  },
  {
    id: 'admin-1',
    username: 'mvc',
    email: 'mvc@example.com',
    password: 'mvc', // In a real app, NEVER store plain text passwords
    role: 'admin',
  },
];

// Mock properties
export const mockProperties = [
  {
    id: 'prop-1',
    title: 'Modern Waterfront Condo',
    description: 'Luxurious 2-bedroom condo with stunning ocean views and modern finishes throughout.',
    type: 'residential',
    propertyType: 'condo',
    price: 750000,
    bedrooms: 2,
    bathrooms: 2,
    area: 1200,
    address: {
      street: '123 Ocean View Blvd',
      city: 'Miami',
      state: 'FL',
      zipCode: '33139',
    },
    images: ['/assets/property1.jpg', '/assets/property1-2.jpg'],
    features: ['Ocean View', 'Balcony', 'Pool', 'Gym', 'Parking'],
    listed: new Date('2025-01-15').toISOString(),
    ownerId: 'user-1',
    status: 'active',
  },
  {
    id: 'prop-2',
    title: 'Downtown Retail Space',
    description: 'Prime retail location in the heart of downtown with high foot traffic and excellent visibility.',
    type: 'commercial',
    propertyType: 'retail',
    price: 1200000,
    area: 2500,
    address: {
      street: '456 Main Street',
      city: 'Austin',
      state: 'TX',
      zipCode: '78701',
    },
    images: ['/assets/property2.jpg'],
    features: ['Store Front', 'Storage Room', 'High Ceiling', 'Central AC'],
    listed: new Date('2025-02-10').toISOString(),
    ownerId: 'user-1',
    status: 'active',
  },
  {
    id: 'prop-3',
    title: 'Suburban Family Home',
    description: 'Spacious 4-bedroom family home in a quiet, family-friendly neighborhood with excellent schools.',
    type: 'residential',
    propertyType: 'house',
    price: 550000,
    bedrooms: 4,
    bathrooms: 3,
    area: 2800,
    address: {
      street: '789 Maple Drive',
      city: 'Denver',
      state: 'CO',
      zipCode: '80220',
    },
    images: ['/assets/property3.jpg', '/assets/property3-2.jpg'],
    features: ['Backyard', 'Garage', 'Fireplace', 'Basement', 'Deck'],
    listed: new Date('2025-03-05').toISOString(),
    ownerId: 'admin-1',
    status: 'active',
  },
  {
    id: 'prop-4',
    title: 'Office Building with Parking',
    description: 'Three-story office building with ample parking, conference rooms, and modern amenities.',
    type: 'commercial',
    propertyType: 'office',
    price: 3500000,
    area: 15000,
    address: {
      street: '321 Business Parkway',
      city: 'Seattle',
      state: 'WA',
      zipCode: '98101',
    },
    images: ['/assets/property4.jpg'],
    features: ['Elevator', 'Conference Rooms', 'Kitchen', 'Security System', 'Parking Lot'],
    listed: new Date('2025-01-20').toISOString(),
    ownerId: 'admin-1',
    status: 'active',
  },
];

// Mock bids
export const mockBids = [
  {
    id: 'bid-1',
    propertyId: 'prop-1',
    userId: 'user-1',
    amount: 720000,
    message: 'I would like to close quickly if possible.',
    status: 'pending',
    timestamp: new Date('2025-03-15').toISOString(),
  },
  {
    id: 'bid-2',
    propertyId: 'prop-1',
    userId: 'admin-1',
    amount: 735000,
    message: 'Pre-approved for financing. Can close in 30 days.',
    status: 'pending',
    timestamp: new Date('2025-03-16').toISOString(),
  },
  {
    id: 'bid-3',
    propertyId: 'prop-3',
    userId: 'user-1',
    amount: 540000,
    message: 'Love the property! Flexible on closing date.',
    status: 'accepted',
    timestamp: new Date('2025-03-10').toISOString(),
  },
];

// Mock agent contracts
export const mockAgentContracts = [
  {
    id: 'contract-1',
    propertyId: 'prop-2',
    ownerId: 'user-1',
    agentId: 'admin-1',
    commission: 5.5,
    status: 'active',
    startDate: new Date('2025-02-15').toISOString(),
    endDate: new Date('2025-08-15').toISOString(),
  },
  {
    id: 'contract-2',
    propertyId: 'prop-4',
    ownerId: 'admin-1',
    agentId: 'user-1',
    commission: 4.0,
    status: 'pending',
    startDate: new Date('2025-03-01').toISOString(),
    endDate: new Date('2025-09-01').toISOString(),
  },
];

// Mock pricing plans
export const mockPricingPlans = [
  {
    id: 'plan-1',
    name: 'Basic',
    description: 'For individual property owners',
    price: 0,
    features: [
      'List up to 2 properties',
      'Basic property details',
      'Standard visibility in search results',
      'Email support',
    ],
    mostPopular: false,
  },
  {
    id: 'plan-2',
    name: 'Professional',
    description: 'For real estate agents and brokers',
    price: 49.99,
    features: [
      'List up to 25 properties',
      'Detailed property information',
      'Featured listings in search results',
      'Priority email and phone support',
      'Property analytics dashboard',
      'Contract management tools',
    ],
    mostPopular: true,
  },
  {
    id: 'plan-3',
    name: 'Enterprise',
    description: 'For large agencies and developers',
    price: 199.99,
    features: [
      'Unlimited property listings',
      'Premium property showcase',
      'Top placement in search results',
      'Dedicated account representative',
      'Advanced analytics and reporting',
      'API access for integration with your systems',
      'Custom branding options',
    ],
    mostPopular: false,
  },
];

// Helper function to generate a new property
export const createProperty = (propertyData: any, ownerId: string) => {
  return {
    id: `prop-${uuidv4()}`,
    ...propertyData,
    ownerId,
    listed: new Date().toISOString(),
    status: 'active',
  };
};

// Helper function to create a new bid
export const createBid = (propertyId: string, userId: string, amount: number, message: string) => {
  return {
    id: `bid-${uuidv4()}`,
    propertyId,
    userId,
    amount,
    message,
    status: 'pending',
    timestamp: new Date().toISOString(),
  };
};

// Helper function to create a new agent contract
export const createAgentContract = (
  propertyId: string,
  ownerId: string,
  agentId: string,
  commission: number,
  durationMonths: number
) => {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setMonth(endDate.getMonth() + durationMonths);
  
  return {
    id: `contract-${uuidv4()}`,
    propertyId,
    ownerId,
    agentId,
    commission,
    status: 'pending',
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
  };
};

import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "67d830b192dca4c85883f02d", 
  requiresAuth: true // Ensure authentication is required for all operations
});

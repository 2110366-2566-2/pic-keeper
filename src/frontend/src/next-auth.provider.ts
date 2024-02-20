// next-auth.providers.js
import axios from 'axios'; 
import { apiBaseUrl } from 'next-auth/client/_utils';

const GoogleBackendProvider = (options: any) => {
  return {
    id: "google-backend",
    name: "Google",
    type: "oauth",
    version: "2.0",
    ...options,
    authorization: `${apiBaseUrl}/authen/v1/google/login`, // URL to initiate OAuth with Google through your backend
    token: `${apiBaseUrl}/authen/v1/google/callback`, // Your backend endpoint that handles the callback
    async profile(profile: { id: any; name: any; email: any; }) {
      // Transform the profile into a format expected by your application
      return {
        id: profile.id,
        name: profile.name,
        email: profile.email
      };
    },
};

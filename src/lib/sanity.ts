// src/lib/sanity.ts
import { createClient } from '@sanity/client'

// This is the configuration for our Sanity client
export const client = createClient({
  // Find these in your .env.local file
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,

  // Use the Content Delivery Network (CDN) in production for faster performance
  useCdn: process.env.NODE_ENV === 'production',

  // Specify the API version to ensure consistency
  apiVersion: '2024-06-26', 
})
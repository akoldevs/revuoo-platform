// src/lib/types.ts

// Using 'interface' is often preferred for object shapes
export interface Profile {
  full_name: string | null;
}

export interface BusinessResponse {
  response_text: string;
  created_at: string;
  status: string;
}

export interface Business {
  id: number;
  name: string;
  slug: string;
}

export interface Review {
  id: number;
  created_at: string;
  title: string;
  summary: string;
  overall_rating: number | null;
  status: string;
  profiles: Profile | null;
  businesses: Business | null;
  business_responses: BusinessResponse[];
  upvote_count: number; // <-- ADD THIS
  downvote_count: number; // <-- ADD THIS
}
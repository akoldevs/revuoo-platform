// src/app/api/test-db/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Check if the environment variables are available
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Supabase URL or Service Role Key is missing from environment variables.')
    }

    // Create a basic Supabase client using the service_role key
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false } }
    )

    // Attempt to fetch all users from the public.users table created by NextAuth
    const { data, error } = await supabase.from('users').select('*')

    if (error) {
      // If there's an error from the query, throw it
      throw error
    }

    // If successful, return the data
    return NextResponse.json({ message: 'Successfully connected to Supabase and fetched data.', data: data })

  } catch (error: unknown) {
    let message = 'Unknown error';
    let details: string | undefined = undefined;
    let code: string | undefined = undefined;

    if (error && typeof error === 'object') {
      if ('message' in error && typeof (error as { message?: unknown }).message === 'string') {
        message = (error as { message?: string }).message as string;
      }
      if ('details' in error && typeof (error as { details?: unknown }).details === 'string') {
        details = (error as { details?: string }).details as string;
      }
      if ('code' in error && typeof (error as { code?: unknown }).code === 'string') {
        code = (error as { code?: string }).code as string;
      }
    }

    return NextResponse.json(
      { 
        message: 'An error occurred during the test.', 
        error: {
          message,
          details,
          code,
        } 
      }, 
      { status: 500 }
    )
  }
}
// src/components/AuthButton.tsx
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { Button } from './ui/button';

export default async function AuthButton() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // This component now ONLY renders if the user is NOT logged in.
  return user ? null : (
    <Link href="/login">
      <Button>Login</Button>
    </Link>
  );
}
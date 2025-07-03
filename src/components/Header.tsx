// src/components/Header.tsx
import Link from 'next/link';
import AuthButton from './AuthButton';
import { createClient } from '@/lib/supabase/server';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LifeBuoy, LogOut, PanelTop, Star, User } from 'lucide-react'; // Removed CircleUser

export default async function Header() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Fetch user profile/role data if the user is logged in
  const { data: profile } = user ? await supabase
    .from('users')
    .select('full_name, role')
    .eq('id', user.id)
    .single() : { data: null };

  return (
    <header className="w-full border-b border-b-foreground/10 h-16 sticky top-0 bg-white z-20">
      <div className="w-full max-w-6xl mx-auto flex justify-between items-center h-full px-6">
        
        <Link href="/" className="font-bold text-xl hover:underline mr-4">
          Revuoo
        </Link>

        {/* --- Middle Navigation --- */}
        {/* Note: In a future step, we can make this mega menu dynamic */}
        <nav className="hidden md:flex flex-grow justify-center">
            <Link href="/reviews" className="px-3 py-2 text-sm font-medium hover:bg-gray-100 rounded-md">Reviews</Link>
            <Link href="/blog" className="px-3 py-2 text-sm font-medium hover:bg-gray-100 rounded-md">Guides & Insights</Link>
            <Link href="/categories" className="px-3 py-2 text-sm font-medium hover:bg-gray-100 rounded-md">Categories</Link>
            <Link href="/write-a-review" className="px-3 py-2 text-sm font-medium hover:bg-gray-100 rounded-md">Write a Review</Link>
        </nav>
        
        {/* --- Right Side: User Menu or Login Button --- */}
        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="secondary" className="relative">
                   {profile?.full_name || user.email}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{profile?.full_name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                   <Link href="/dashboard/my-reviews"><Star className="mr-2 h-4 w-4" /><span>My Reviews</span></Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                   <Link href="/dashboard/account"><User className="mr-2 h-4 w-4" /><span>My Account</span></Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                
                {/* --- Conditional Admin Link --- */}
                {profile?.role === 'admin' && (
                  <DropdownMenuItem asChild>
                     <Link href="/admin"><PanelTop className="mr-2 h-4 w-4" /><span>Admin Dashboard</span></Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuItem asChild>
                   <Link href="/support"><LifeBuoy className="mr-2 h-4 w-4" /><span>Support</span></Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <form action="/auth/sign-out" method="post">
                   <DropdownMenuItem asChild>
                      <button className="w-full"><LogOut className="mr-2 h-4 w-4" /><span>Log out</span></button>
                   </DropdownMenuItem>
                </form>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <AuthButton />
          )}
        </div>
      </div>
    </header>
  );
}
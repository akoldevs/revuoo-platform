// src/components/Header.tsx
import Link from 'next/link';
import AuthButton from './AuthButton';

export default function Header() {
  return (
    <header className="w-full border-b border-b-foreground/10 h-16">
      <div className="w-full max-w-6xl mx-auto flex justify-between items-center h-full px-6">

        <Link href="/" className="font-bold text-xl hover:underline">
          Revuoo
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm">
          <Link href="/reviews" className="text-gray-600 hover:text-black">Reviews</Link>
          <Link href="/blog" className="text-gray-600 hover:text-black">Blog</Link>
          <Link href="/categories" className="text-gray-600 hover:text-black">Categories</Link>
          <Link href="/write" className="text-gray-600 hover:text-black">Write for Us</Link>
        </nav>

        <div className="flex items-center">
          <AuthButton />
        </div>

      </div>
    </header>
  );
}
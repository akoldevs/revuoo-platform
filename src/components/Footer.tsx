// src/components/Footer.tsx
import Link from 'next/link'

// We will add the 'asChild' prop pattern here to fix the warning
const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <li>
    <Link href={href} className="text-gray-600 hover:text-black hover:underline transition-colors text-sm">
      {children}
    </Link>
  </li>
);

export default function Footer() {
  return (
    <footer className="w-full bg-gray-100 border-t mt-auto">
      <div className="w-full max-w-6xl mx-auto py-12 px-6 grid grid-cols-2 sm:grid-cols-4 gap-8">
        
        {/* Column 1: Brand */}
        <div className="sm:col-span-1 space-y-4">
          <Link href="/" className="font-bold text-2xl">Revuoo</Link>
          <p className="text-sm text-gray-600">Real Reviews. Real Knowledge.</p>
        </div>

        {/* Column 2: Discover */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm uppercase">Discover</h3>
          <ul className="space-y-3">
            <FooterLink href="/reviews">Reviews</FooterLink>
            <FooterLink href="/blog">Guides & Insights</FooterLink>
            <FooterLink href="/categories">Categories</FooterLink>
            <FooterLink href="#">How Revuoo Works</FooterLink>
          </ul>
        </div>

        {/* Column 3: For Partners */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm uppercase">For Partners</h3>
          <ul className="space-y-3">
            <FooterLink href="#">List Your Business</FooterLink>
            <FooterLink href="/write">Become a Contributor</FooterLink>
            <FooterLink href="#">Claim Your Profile</FooterLink>
            <FooterLink href="#">Affiliate Program</FooterLink>
          </ul>
        </div>

        {/* Column 4: Company & Legal */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm uppercase">Company</h3>
          <ul className="space-y-3">
            <FooterLink href="#">About Us</FooterLink>
            <FooterLink href="#">Plans & Pricing</FooterLink>
            <FooterLink href="#">Investor Relations</FooterLink>
            <FooterLink href="#">Terms of Service</FooterLink>
            <FooterLink href="#">Privacy Policy</FooterLink>
          </ul>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto px-6 py-6 border-t">
        <p className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Revuoo. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
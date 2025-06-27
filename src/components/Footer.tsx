// src/components/Footer.tsx
import Link from 'next/link'

export default function Footer() {
  // We'll keep this reusable component for footer links
  const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
    <li>
      <Link href={href} className="text-gray-600 hover:text-black hover:underline transition-colors text-sm">
        {children}
      </Link>
    </li>
  );

  return (
    <footer className="w-full bg-gray-100 border-t mt-auto">
      <div className="w-full max-w-6xl mx-auto py-12 px-6 grid grid-cols-2 md:grid-cols-5 gap-8">

        {/* --- NEW BRAND COLUMN --- */}
        <div className="md:col-span-2 space-y-4 pr-8">
          <Link href="/" className="font-bold text-2xl">Revuoo</Link>
          <p className="text-sm text-gray-600">Real Reviews. Real Knowledge.</p>
          {/* We'll add social media icons here later */}
        </div>
        {/* --- END OF NEW BRAND COLUMN --- */}

        {/* Column 2: Discover */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Discover</h3>
          <ul className="space-y-2">
            <FooterLink href="/reviews">Reviews</FooterLink>
            <FooterLink href="/blog">Guides & Insights</FooterLink>
            <FooterLink href="/categories">Categories</FooterLink>
            <FooterLink href="#">How Revuoo Works</FooterLink>
          </ul>
        </div>

        {/* Column 3: For Partners */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">For Partners</h3>
          <ul className="space-y-2">
            <FooterLink href="#">List Your Business</FooterLink>
            <FooterLink href="/write">Become a Contributor</FooterLink>
            <FooterLink href="#">Claim Your Profile</FooterLink>
            <FooterLink href="#">Affiliate Program</FooterLink>
          </ul>
        </div>

        {/* Column 4: Company & Legal */}
        <div className="space-y-4">
          <h3 className="font-semibold text-sm">Company</h3>
          <ul className="space-y-2">
            <FooterLink href="#">About Us</FooterLink>
            <FooterLink href="#">Plans & Pricing</FooterLink>
            <FooterLink href="#">Investor Relations</FooterLink>
            <FooterLink href="#">Careers</FooterLink>
            <FooterLink href="#">Help Center</FooterLink>
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
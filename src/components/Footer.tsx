// src/components/Footer.tsx

import Link from "next/link";
import { Twitter, Linkedin, Facebook, Globe } from "lucide-react";
import { Button } from "./ui/button";

const FooterLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <li>
    <Link
      href={href}
      className="text-gray-500 hover:text-gray-900 hover:underline transition-colors text-sm leading-6"
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
    >
      {children}
    </Link>
  </li>
);

const FooterColumn = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-4">
    <h3 className="font-semibold text-sm uppercase text-gray-900">{title}</h3>
    <ul className="space-y-2">{children}</ul>
  </div>
);

export default function Footer() {
  return (
    <footer
      className="w-full bg-gray-100 border-t mt-auto"
      itemScope
      itemType="https://schema.org/WPFooter"
    >
      <div className="w-full max-w-7xl mx-auto py-16 px-6">
        {/* --- Main Footer Columns --- */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
          <div className="col-span-2 lg:col-span-2 space-y-4">
            <Link href="/" className="font-bold text-2xl" itemProp="url">
              <span itemProp="name">Revuoo</span>
            </Link>
            <p
              className="text-sm text-gray-600 max-w-xs"
              itemProp="description"
            >
              Revuoo is the trusted platform for verified reviews, AI-powered
              insights, and reputation tools for modern businesses.
            </p>
          </div>

          <FooterColumn title="Discover">
            <FooterLink href="/reviews">All Reviews</FooterLink>
            <FooterLink href="/categories">All Categories</FooterLink>
            <FooterLink href="/blog">Guides & Insights</FooterLink>
            <FooterLink href="/sitemap">Sitemap</FooterLink>
          </FooterColumn>

          <FooterColumn title="For Businesses">
            <FooterLink href="/for-businesses">List Your Business</FooterLink>
            <FooterLink href="/for-businesses/plans-pricing">
              Plans & Pricing
            </FooterLink>
            <FooterLink href="/for-businesses/widgets-integrations">
              Get Widgets
            </FooterLink>
            <FooterLink href="/affiliates">Affiliate Program</FooterLink>
          </FooterColumn>

          <FooterColumn title="For Contributors">
            <FooterLink href="/for-contributors">
              Become a Contributor
            </FooterLink>
            <FooterLink href="/for-contributors/guidelines">
              Contributor Guidelines
            </FooterLink>
          </FooterColumn>

          <FooterColumn title="Company">
            <FooterLink href="/about">About Us</FooterLink>
            <FooterLink href="/careers">Careers</FooterLink>
            <FooterLink href="/contact">Contact</FooterLink>
          </FooterColumn>
        </div>

        {/* --- Sub-Footer with Legal, Social, and Language --- */}
        <div className="mt-16 pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
              <FooterLink href="/help">Help Center</FooterLink>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/terms">Terms of Service</FooterLink>
              <FooterLink href="/trust-safety">Trust & Safety</FooterLink>
            </div>
            <div>
              <Button variant="outline" size="sm">
                <Globe className="h-4 w-4 mr-2" />
                English
              </Button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mt-8">
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} Revuoo. All rights reserved.
            </p>
            <div className="flex items-center gap-x-6">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer nofollow"
                aria-label="Twitter"
                className="text-gray-400 hover:text-gray-500"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer nofollow"
                aria-label="LinkedIn"
                className="text-gray-400 hover:text-gray-500"
              >
                <Linkedin className="h-5 w-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer nofollow"
                aria-label="Facebook"
                className="text-gray-400 hover:text-gray-500"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

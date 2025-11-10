"use client";

import { Button } from "@/app/components/ui/button";
import { useCart } from "@/app/context/CartContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState } from "react";

// Simple loading spinner component
const LoadingSpinner = () => (
  <svg className="animate-spin w-5 h-5 text-muted-foreground" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

// User Account Component (extracted for clarity)
// User Account Component (Responsive)
const UserAccount = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const toggleDropdown = useCallback(() => setIsDropdownOpen((prev) => !prev), []);
  const toggleMobileMenu = useCallback(() => setIsMobileMenuOpen((prev) => !prev), []);
  const isAdmin = (session?.user as { role?: string })?.role === "admin";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = useCallback(() => {
    signOut({ callbackUrl: "/" });
    setIsDropdownOpen(false);
    setIsMobileMenuOpen(false);
  }, []);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center p-2">
        <LoadingSpinner />
      </div>
    );
  }

  // Authenticated user
  if (status === "authenticated" && session?.user) {
    return (
      <>
        {/* Desktop Dropdown */}
        <div className="hidden md:block relative" ref={dropdownRef}>
          <button
            onClick={toggleDropdown}
            className="p-2 rounded-full hover:bg-secondary/10 focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.428 15.341A8.966 8.966 0 0121 12c0-1.31-.21-2.571-.608-3.741M16 19.128a9.015 9.015 0 01-8 0" />
            </svg>
          </button>

          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-background border border-border rounded-md shadow-lg z-10 animate-in fade-in duration-200">
              <div className="py-1">
                <Link href="/dashboard" className="block px-4 py-2 text-sm hover:bg-secondary/10" onClick={() => setIsDropdownOpen(false)}>Profile</Link>
                <Link href="/orders" className="block px-4 py-2 text-sm hover:bg-secondary/10" onClick={() => setIsDropdownOpen(false)}>My Orders</Link>
                <Link href="/settings" className="block px-4 py-2 text-sm hover:bg-secondary/10" onClick={() => setIsDropdownOpen(false)}>Settings</Link>
                <hr className="my-1 border-border" />
                <button onClick={handleSignOut} className="w-full text-left px-4 py-2 text-sm text-destructive hover:bg-destructive/10">Sign Out</button>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-full hover:bg-secondary/10 focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>

          {isMobileMenuOpen && (
            <div className="fixed inset-0 bg-background/90 z-20 p-6 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">My Account</h2>
                <button onClick={toggleMobileMenu} className="p-2 rounded-full hover:bg-secondary/10">
                  ✕
                </button>
              </div>

              {/* User Info */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center text-2xl">
                  {session.user.name?.charAt(0) ?? "U"}
                </div>
                <h3 className="mt-2 text-lg font-medium">{session.user.name}</h3>
                <p className="text-sm text-muted-foreground">{session.user.email}</p>
              </div>

              {/* Nav Links */}
              <div className="flex flex-col gap-4 text-center">
                <Link href="/dashboard" onClick={toggleMobileMenu} className="text-base hover:text-accent transition">Profile</Link>
                <Link href="/shop" onClick={toggleMobileMenu} className="text-base hover:text-accent transition">Shop</Link>
                <Link href="/about" onClick={toggleMobileMenu} className="text-base hover:text-accent transition">About</Link>
                <Link href="/wishlist" onClick={toggleMobileMenu} className="text-base hover:text-accent transition">Wishlist</Link>
                <Link href="/orders" onClick={toggleMobileMenu} className="text-base hover:text-accent transition">My Orders</Link>
                <Link href="/settings" onClick={toggleMobileMenu} className="text-base hover:text-accent transition">Settings</Link>
                {isAdmin && <Link href="/admin" onClick={toggleMobileMenu} className="text-base hover:text-accent transition">Admin</Link>}
                <button onClick={handleSignOut} className="mt-4 py-2 text-destructive border border-destructive rounded-md hover:bg-destructive/10 transition">Sign Out</button>
              </div>
            </div>
          )}
        </div>
      </>
    );
  }

  // Guest (not logged in)
  return (
    <Button variant="outline" size="sm" onClick={() => router.push("/login")}>
      Sign In
    </Button>
  );
};


const Navigation = () => {
  const { getItemCount } = useCart();
  const count = getItemCount();
  const { data: session, status } = useSession();
  const isAdmin = (session?.user as { role?: string })?.role === "admin";
  const router = useRouter();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-playfair font-semibold tracking-wider text-yellow-600">
          <Link href="/">FASHNOVA</Link>
        </h1>

        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm hover:text-accent transition-colors">
            Home
          </Link>
          <Link href="/shop" className="text-sm hover:text-accent transition-colors">
            Shop
          </Link>
          <Link href="/about" className="text-sm hover:text-accent transition-colors">
            About
          </Link>
          <Link href="/wishlist" className="text-sm hover:text-accent transition-colors">
            Wishlist
          </Link>
          {isAdmin && (
            <Link href="/admin" className="text-sm hover:text-accent transition-colors">
              Admin
            </Link>
          )}
        </div>

        {/* Elegant Search Bar */}
        <div className="hidden md:flex items-center relative group">
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search collections..."
              className="w-[250px] px-4 py-2 rounded-full bg-background border-2 border-secondary/20
                       text-foreground placeholder:text-muted-foreground/50
                       focus:outline-none focus:border-secondary/50 focus:ring-2 focus:ring-secondary/10
                       transition-all duration-300 pr-12
                       hover:border-secondary/30"
              aria-label="Search collections"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  const query = (e.target as HTMLInputElement).value.trim();
                  if (query) {
                    router.push(`/shop?search=${encodeURIComponent(query)}`);
                  }
                }
              }}
            />
            <button
              className="absolute right-3 p-1 rounded-full hover:bg-secondary/10
                           text-secondary transition-all duration-300
                           focus:outline-none focus:ring-2 focus:ring-secondary/20"
              aria-label="Submit search"
              onClick={() => {
                const input = document.querySelector('input[placeholder="Search collections..."]') as HTMLInputElement;
                const query = input?.value.trim();
                if (query) {
                  router.push(`/shop?search=${encodeURIComponent(query)}`);
                }
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/cart"
            className="relative p-2 rounded-full hover:bg-secondary/10 focus:outline-none focus:ring-2 focus:ring-secondary/20 transition-colors"
            aria-label={`Open cart with ${count} items`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4" />
              <circle cx="10" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
            </svg>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-semibold leading-none text-white bg-destructive rounded-full">
                {count}
              </span>
            )}
          </Link>

          <UserAccount />
        </div>
      </nav>
    </header>
  );
};

export default Navigation;

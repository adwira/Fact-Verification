"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";

const NAV_LINKS = [
  { href: "#features", label: "Features" },
  { href: "#pricing", label: "Pricing" },
  { href: "#contact", label: "Contact" },
  { href: "#affiliates", label: "Affiliates" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0B0A15]/80 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 text-white">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <MessageCircle className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold tracking-tight">VERIFAI</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="text-sm text-muted-foreground transition-colors hover:text-white"
            >
              {label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/verification"
            className="inline-flex h-9 items-center justify-center rounded-lg border border-red-400/60 bg-transparent px-4 text-sm font-medium text-white shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-colors hover:bg-white/5"
          >
            Chat
          </Link>
          <Link
            href="#signin"
            className="inline-flex h-9 items-center justify-center rounded-lg border border-red-400/60 bg-transparent px-4 text-sm font-medium text-white shadow-[0_0_15px_rgba(239,68,68,0.3)] transition-colors hover:bg-white/5"
          >
            Sign In
          </Link>
          <Link
            href="#signup"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </header>
  );
}

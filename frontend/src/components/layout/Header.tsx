"use client";

import Link from "next/link";
import { ShieldCheck, Globe } from "lucide-react";

interface HeaderProps {
  currentLang?: "id" | "en";
  onLanguageChange?: (lang: "id" | "en") => void;
}

export function Header({ currentLang = "id", onLanguageChange }: HeaderProps) {
  const isId = currentLang === "id";

  const navItems = [
    { href: "#cara-kerja", labelId: "Cara Kerja", labelEn: "How It Works" },
    { href: "#kepercayaan", labelId: "Kredibilitas", labelEn: "Credibility" },
    { href: "#target-pengguna", labelId: "Untuk Siapa", labelEn: "Who It's For" },
    { href: "#evaluasi", labelId: "Evaluasi", labelEn: "Benchmark" },
    { href: "#faq", labelId: "FAQ", labelEn: "FAQ" },
    { href: "#tentang-kami", labelId: "Tentang", labelEn: "About" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0B0E14]/85 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 text-white transition-opacity hover:opacity-90"
          aria-label="VerifAI Beranda"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white shadow-sm shadow-primary/30">
            <ShieldCheck className="h-5 w-5" aria-hidden="true" />
          </div>
          <span className="font-bold tracking-tight text-lg">VERIFAI</span>
        </Link>

        {/* Section Navigation */}
        <nav className="hidden md:flex items-center gap-6" aria-label="Navigasi Utama">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-xs font-medium text-muted-foreground transition-colors hover:text-white"
            >
              {isId ? item.labelId : item.labelEn}
            </a>
          ))}
        </nav>

        {/* Actions: Lang Toggle & CTA */}
        <div className="flex items-center gap-3">
          {onLanguageChange && (
            <button
              type="button"
              onClick={() => onLanguageChange(isId ? "en" : "id")}
              className="inline-flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
              aria-label={isId ? "Ganti ke Bahasa Inggris" : "Switch to Indonesian"}
            >
              <Globe className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{isId ? "EN" : "ID"}</span>
            </button>
          )}

          <Link
            href="/verification"
            className="inline-flex h-9 items-center justify-center rounded-lg bg-primary px-4 text-xs font-semibold text-white shadow transition-colors hover:bg-primary/90"
          >
            {isId ? "Coba Verifikasi" : "Try Verification"}
          </Link>
        </div>
      </div>
    </header>
  );
}

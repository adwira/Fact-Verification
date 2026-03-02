"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, LayoutDashboard, Settings, History, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const SIDEBAR_NAV = [
  { href: "/verification", label: "Dashboard", icon: LayoutDashboard },
  { href: "#setting", label: "Setting", icon: Settings },
  { href: "#history", label: "History", icon: History },
] as const;

const PLACEHOLDER_ITEMS = [
  "Embrace Proven Plan...",
  "Embrace Proven Plan...",
  "Embrace Proven Plan...",
];

export function VerificationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-[#1A1B26]">
      {/* Sidebar */}
      <aside className="flex w-56 flex-col border-r border-border bg-[#1A1B26]">
        <div className="flex h-14 items-center gap-2 border-b border-border px-4">
          <Link href="/" className="flex items-center gap-2 text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <MessageCircle className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold tracking-tight">VERIFAI</span>
          </Link>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {SIDEBAR_NAV.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/90 text-white"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {label}
              </Link>
            );
          })}

          <div className="mt-4 space-y-1">
            {PLACEHOLDER_ITEMS.map((text, i) => (
              <div
                key={i}
                className="rounded-lg px-3 py-2 text-sm text-muted-foreground"
              >
                {text}
              </div>
            ))}
          </div>
        </nav>

        {/* Upgrade Pro */}
        <div className="border-t border-border p-4">
          <p className="font-semibold text-white">Upgrade Pro</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Embrace Proven Plan for Optimal Results.
          </p>
          <Link
            href="#discover-pro"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg bg-[#6D28D9] px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-[#5B21B6]"
          >
            <Sparkles className="h-4 w-4" />
            Discover Pro
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        {/* Header bar */}
        <header className="flex h-14 items-center justify-between border-b border-border bg-[#1A1B26] px-6">
          <h1 className="text-lg font-medium text-white">Dashboard</h1>
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-muted">
            <span className="text-xs font-medium text-muted-foreground">U</span>
          </div>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}

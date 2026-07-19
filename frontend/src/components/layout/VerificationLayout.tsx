"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageCircle, LayoutDashboard, Settings, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const SIDEBAR_NAV = [
  { href: "/verification", label: "Dashboard", icon: LayoutDashboard },
  { href: "#setting", label: "Setting", icon: Settings },
] as const;



export function VerificationLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex h-[100dvh] w-full bg-background overflow-hidden relative">
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden" 
          onClick={() => setIsMobileOpen(false)} 
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-card transition-transform duration-300 ease-in-out md:static md:translate-x-0 md:w-56",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-4">
          <Link href="/" className="flex items-center gap-2 text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
              <MessageCircle className="h-5 w-5 text-primary" />
            </div>
            <span className="font-bold tracking-tight text-white">VERIFAI</span>
          </Link>
          <button className="md:hidden" onClick={() => setIsMobileOpen(false)}>
            <X className="h-5 w-5 text-muted-foreground hover:text-white" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {SIDEBAR_NAV.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "border-l-4 border-primary bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg"
                )}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {label}
              </Link>
            );
          })}


        </nav>


      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col min-w-0">
        {/* Header bar */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button className="md:hidden p-1" onClick={() => setIsMobileOpen(true)}>
              <Menu className="h-5 w-5 text-muted-foreground hover:text-white" />
            </button>
            <h1 className="text-lg font-medium text-muted-foreground">Halaman Dasbor</h1>
          </div>
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-muted">
            <span className="text-xs font-medium text-muted-foreground">U</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
